import { prisma } from "../src/db/prisma.js";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Seeding matches, tournaments, and stats...");

  const userIds = Array.from({ length: 12 }, (_, i) => i + 1); // Users 1-12

  // ---------------------------
  // Create matches and populate MatchPlayer
  // ---------------------------
  for (let i = 0; i < 20; i++) { // 20 random matches
    const [p1, p2] = [userIds[randomInt(0, userIds.length - 1)], userIds[randomInt(0, userIds.length - 1)]];
    if (p1 === p2) continue;

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

    // Update stats for winner
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

    // Update stats for loser
    const loserId = p1 === winnerId ? p2 : p1;
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

  console.log("Random matches and stats seeded.");

  // ---------------------------
  // Create a tournament
  // ---------------------------
  const tournament = await prisma.tournament.create({
    data: {
      name: "Test Tournament",
      state: "finished",
      max_players: 8,
    },
  });

  // Pick 8 random users for the tournament
  const tournamentUsers = userIds.sort(() => 0.5 - Math.random()).slice(0, 8);

  for (const uid of tournamentUsers) {
    await prisma.tournamentPlayer.create({
      data: {
        tournament_id: tournament.id,
        user_id: uid,
        alias: `Player${uid}`,
      },
    });
  }

  // Create tournament matches
  const tournamentMatches = [];
  for (let i = 0; i < tournamentUsers.length; i += 2) {
    const [p1, p2] = [tournamentUsers[i], tournamentUsers[i + 1]];
    const winnerId = Math.random() > 0.5 ? p1 : p2;

    const match = await prisma.match.create({
      data: {
        game_name: "pong",
        winner_id: winnerId,
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

    tournamentMatches.push({ match, winnerId, p1, p2 });
  }

  // Choose tournament winner randomly from round 1 winners
  const finalWinner = tournamentMatches[randomInt(0, tournamentMatches.length - 1)].winnerId;
  await prisma.tournament.update({
    where: { id: tournament.id },
    data: { winner_id: finalWinner, state: "finished", finished_at: new Date() },
  });

  // Update tournament champion stats
  await prisma.statsUser.upsert({
    where: { user_id: finalWinner },
    update: { tournament_championships: { increment: 1 } },
    create: { user_id: finalWinner, tournament_championships: 1 },
  });

  console.log("Tournament seeded, winner:", finalWinner);

  // ---------------------------
  // Optional: update friends count for all users
  // ---------------------------
  for (const uid of userIds) {
    const friendsCount = await prisma.friend.count({ where: { user_id: uid } });
    await prisma.statsUser.upsert({
      where: { user_id: uid },
      update: { friends_count: friendsCount },
      create: { user_id: uid, friends_count: friendsCount },
    });
  }

  console.log("User stats updated. Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
