import { prisma } from "../src/db/prisma.js";
import { hashPassword } from "../src/services/auth.service.js"; // wherever your AuthService lives

// import crypto from "crypto";

const users = await prisma.user.count();
if (users > 9) {
  console.log("Database already seeded, skipping.");
  process.exit(0);
}

/* ---------------- Utilities ---------------- */

// function hashPassword(password: string): string {
//   return crypto.createHash("sha256").update(password).digest("hex");
// }

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/* ---------------- Constants ---------------- */

const USER_COUNT = 12;
const MATCH_COUNT = 20;
const GAMES = ["pong", "connect4"] as const;

/* ---------------- Seed Logic ---------------- */

async function seedUsers() {
  console.log("Seeding users...");

  const users = [];

  for (let i = 1; i <= USER_COUNT; i++) {
    const username = `user${i}`;

    const user = await prisma.user.create({
      data: {
        email: `${username}@example.com`,
        username,
        password_hash: hashPassword(username),
        isAdmin: i === 1,
      },
    });

    users.push(user);
  }

  return users;
}

async function seedMatches(users: { id: number }[]) {
  console.log("Seeding matches...");

  const userIds = users.map(u => u.id);

  for (let i = 0; i < MATCH_COUNT; i++) {
    const p1 = randomFrom(userIds);
    const p2 = randomFrom(userIds);
    if (p1 === p2) continue;

    const winnerId = Math.random() > 0.5 ? p1 : p2;
    const loserId = p1 === winnerId ? p2 : p1;

    const game = randomFrom(GAMES);

    await prisma.match.create({
      data: {
        game_name: game,
        winner_id: winnerId,
        finished_at: new Date(),
        players: {
          create: [
            {
              user_id: p1,
              score: randomInt(0, game === "pong" ? 21 : 10),
              is_winner: p1 === winnerId,
            },
            {
              user_id: p2,
              score: randomInt(0, game === "pong" ? 21 : 10),
              is_winner: p2 === winnerId,
            },
          ],
        },
      },
    });

    // Winner stats
    await prisma.statsUser.upsert({
      where: { user_id: winnerId },
      update: {
        wins: { increment: 1 },
        total_score: { increment: 10 },
        last_match_at: new Date(),
      },
      create: {
        user_id: winnerId,
        wins: 1,
        losses: 0,
        total_score: 10,
        last_match_at: new Date(),
      },
    });

    // Loser stats
    await prisma.statsUser.upsert({
      where: { user_id: loserId },
      update: {
        losses: { increment: 1 },
        total_score: { increment: 5 },
        last_match_at: new Date(),
      },
      create: {
        user_id: loserId,
        wins: 0,
        losses: 1,
        total_score: 5,
        last_match_at: new Date(),
      },
    });
  }
}

async function seedTournament(users: { id: number }[]) {
  console.log("Seeding tournament...");

  const tournament = await prisma.tournament.create({
    data: {
      name: "Test Tournament",
      state: "finished",
      max_players: 8,
    },
  });

  const shuffled = [...users].sort(() => 0.5 - Math.random()).slice(0, 8);

  for (const user of shuffled) {
    await prisma.tournamentPlayer.create({
      data: {
        tournament_id: tournament.id,
        user_id: user.id,
        alias: `Player${user.id}`,
      },
    });
  }

  const winners: number[] = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    const p1 = shuffled[i].id;
    const p2 = shuffled[i + 1].id;
    const winnerId = Math.random() > 0.5 ? p1 : p2;

    const match = await prisma.match.create({
      data: {
        game_name: "pong",
        winner_id: winnerId,
        finished_at: new Date(),
        players: {
          create: [
            { user_id: p1, score: randomInt(0, 21), is_winner: p1 === winnerId },
            { user_id: p2, score: randomInt(0, 21), is_winner: p2 === winnerId },
          ],
        },
      },
    });

    await prisma.tournamentMatch.create({
      data: {
        tournament_id: tournament.id,
        match_id: match.id,
        round_number: 1,
        match_number_in_round: i / 2 + 1,
      },
    });

    winners.push(winnerId);
  }

  const champion = randomFrom(winners);

  await prisma.tournament.update({
    where: { id: tournament.id },
    data: {
      winner_id: champion,
      finished_at: new Date(),
      state: "finished",
    },
  });

  await prisma.statsUser.upsert({
    where: { user_id: champion },
    update: {
      tournament_championships: { increment: 1 },
    },
    create: {
      user_id: champion,
      tournament_championships: 1,
    },
  });

  console.log("Tournament winner:", champion);
}

async function seedFriendsCount(users: { id: number }[]) {
  for (const user of users) {
    const count = await prisma.friend.count({
      where: { user_id: user.id },
    });

    await prisma.statsUser.upsert({
      where: { user_id: user.id },
      update: { friends_count: count },
      create: { user_id: user.id, friends_count: count },
    });
  }
}

/* ---------------- Main ---------------- */

async function main() {
  console.log("🌱 Seeding database...");

  const users = await seedUsers();
  await seedMatches(users);
  await seedTournament(users);
  await seedFriendsCount(users);

  console.log("✅ Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
