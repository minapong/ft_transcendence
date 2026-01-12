# Matchmaking & Tournament Systems – How They Work

## 1. Connect4 Matchmaking System

### Purpose
Real-time 1v1 matchmaking for Connect4 with automatic cleanup of abandoned games and queue entries.

### Key Principles
- **Fully database-backed** — no fragile in-memory timeouts or localStorage  
- All matchmaking state lives in two db tables: `MatchmakingQueue` and `ActiveMatches`
- **Automatic timeout cleanup** runs on every poll → guarantees no orphan games even after crashes or reloads 
- Results are recorded permanently in the `matches` table  

### Simple Flow Explanation
A player clicks "Play" → joins the queue.  
The system immediately tries to pair them with another waiting player.  
If a pair is found, a new active match is created in the database with status "matched".  
Both players poll regularly; during each poll, the system checks for expired queue entries and abandoned matches and removes them.  
When host player load the game page, the match status is updated to "started".  
When the game ends, the winner is reported → the result is permanently recorded and the active match is deleted.

### API Endpoints (used by frontend)

| Endpoint                          | Method | Purpose                                      |
|-----------------------------------|--------|----------------------------------------------|
| `/api/matchmaking/join`           | POST   | Player joins the Connect4 queue              |
| `/api/matchmaking/state`          | GET    | Poll: returns queued, matched, or active match data |
| `/api/matchmaking/start`          | POST   | Called by client when both players are ready → sets status to "started" |
| `/api/matchmaking/finish`         | POST   | Called when game ends → records winner + cleans up active match |

### Main Queries (matchmakingRepo.ts)

| Query / Function                  | Parameters                                               | Returns                                | Purpose                                                                 |
|-----------------------------------|----------------------------------------------------------|----------------------------------------|-------------------------------------------------------------------------|
| `enqueuePlayer()`                 | `userId: number`, `game: string`                         | void                                   | Insert/replace player in queue with current timestamp                   |
| `dequeueTwoPlayers()`             | `game: string`, `queueTimeoutSeconds: number`            | `[number, number] \| null`             | Cleanup queue + return oldest two players (or null)                     |
| `cleanupQueue()`                  | `game: string`, `timeoutSeconds: number`                 | void                                   | Delete queue entries older than timeout                                 |
| `insertActiveMatch()`             | `match: ActiveMatchDTO`                                  | void                                   | Create new row in ActiveMatches with status "matched"                  |
| `updateActiveMatchStatus()`       | `matchId: string`, `status: MatchStatus`                 | void                                   | Update status and set started_at timestamp when game begins             |
| `deleteActiveMatch()`             | `matchId: string`                                        | void                                   | Remove finished or abandoned match from ActiveMatches                  |
| `getActiveMatchFull()`            | `{ matchId?: string; userId?: number }`                  | `ActiveMatchDTO \| null`               | Unified query: get full match (with player names) by userId or matchId  |
| `getExpiredActiveMatches()`       | `maxMatchedSeconds: number`, `maxStartedSeconds: number` | `string[]` (match IDs)                 | Find matched/started games past their timeout (used for cleanup)        |
| `recordConnect4Game()`            | `p1Id: number`, `p2Id: number`, `winnerId: number`       | `number` (matchId)                     | Insert finished match + player stats into permanent history             |

### Main Functions (matchmakingManager.ts)

| Function                          | Parameters                                      | Returns                                      | Purpose                                                                 |
|-----------------------------------|-------------------------------------------------|----------------------------------------------|-------------------------------------------------------------------------|
| `joinQueue()`                     | `player: Player`                                | `{ status: "already_active""waiting""matched""idle"; match?: ActiveMatchDTO }` | Full matchmaking logic: validate, enqueue, try to pair, create match   |
| `cleanupExpiredMatchesAndQueue()` | none                                            | void                                         | Central cleanup called on every poll                                    |
| `getActiveMatchForUser()`         | `userId: number`                                | `ActiveMatchDTO \| null`                     | Poll endpoint helper: cleanup + return user's active match              |
| `isQueued()`                      | `user_id: number`                               | `boolean`                                    | Poll endpoint helper: cleanup + check if user is in queue               |
| `startMatch()`                    | `matchId: string`                               | `ActiveMatchDTO`                             | Validate and transition match from "matched" to "started"               |
| `finishMatch()`                   | `matchId: string`, `winnerId: number`           | `{ success: true }`                          | Idempotent: record result if match exists, otherwise ignore timeout     |

## 2. Pong Tournament System

### Purpose
Admin-controlled single-elimination tournament for Pong with support for 4 or 8 players, registration phase, automatic bracket generation, and manual round progression.

### Key Principles
- **Fully persistent** — all tournament state, registrations, matches, and results stored in the database  
- **Direct result reporting** from the Pong game page (fire-and-forget with `keepalive: true`)  
- No localStorage used for match or result handoff
- Manual round advancement gives the admin full control and visibility

### Simple Flow Explanation (in words)
An admin creates a new tournament (only one active/waiting at a time).  
Players register until the tournament is full.  
The admin starts the tournament → players are shuffled and first-round matches are created.  
Players see all pending match, they can click on "Start Game" only for their game, play Pong.
When a Pong game ends, the winner is reported directly to the backend API.  
Once all matches in the current round are finished, the admin clicks "Advance Round" → winners are paired for the next round.  
This continues until a final winner is determined and the tournament state becomes "finished".

### API Endpoints (used by frontend)

| Endpoint                          | Method | Purpose                                      |
|-----------------------------------|--------|----------------------------------------------|
| `/api/tournament/create`          | POST   | Admin creates a new tournament               |
| `/api/tournament/register`        | POST   | Player registers for the current tournament  |
| `/api/tournament/start`           | POST   | Admin starts the tournament (must be full)   |
| `/api/tournament/result`          | POST   | Pong game reports the winner of a match      |
| `/api/tournament/next`            | POST   | Admin advances to the next round             |
| `/api/tournament/active`          | GET    | Returns the current waiting/active tournament with full details       |

### Main Queries (tournamentRepo.ts)

| Query / Function                  | Parameters                                      | Returns                                      | Purpose                                                                 |
|-----------------------------------|-------------------------------------------------|----------------------------------------------|-------------------------------------------------------------------------|
| `insertTournament()`              | `name: string`, `maxPlayers: number`            | `number` (new tournament ID)                 | Inserts new tournament row                                              |
| `insertTournamentPlayer()`        | `tournamentId: number`, `userId: number \| null`, `alias?: string` | `number` (row ID)                  | Inserts player into tournament_players junction table                   |
| `insertMatch()`                   | `tournamentId`, `p1Id`, `p2Id`, `roundNumber`, `matchNumber`, `nextMatchId?` | `number` (matchId)               | Transaction: creates match, links to tournament, adds players           |
| `recordMatchWinner()`             | `matchId: number`, `winnerId: number`            | void                                         | Updates the match row with winner_id                                     |
| `updateTournamentState()`         | `tournamentId`, `state`, `currentRound`, `winnerId?` | `TournamentDTO \| null`                 | Updates state, current round, and final winner when tournament ends     |
| `getRegisteredPlayers()`          | `tournamentId: number`                          | `PlayerDTO[]`                                | Returns all registered players with usernames                           |
| `getMatchDTO()`                   | `matchId: number`                               | `MatchDTO`                                   | Builds full match object with both players and status                   |
| `get_ActiveTournament()`          | none                                            | `TournamentDTO \| null`                      | Returns the single waiting or active tournament                         |
| `getTournamentWithMatches()`      | `tournamentId: number`                          | `TournamentDTO \| null`                      | Builds full DTO: tournament + registered players + all matches with details |

### Main Functions (tournamentManager.ts)

| Function                          | Parameters                                      | Returns                                      | Purpose                                                                 |
|-----------------------------------|-------------------------------------------------|----------------------------------------------|-------------------------------------------------------------------------|
| `createTournament()`              | `name: string`, `maxPlayers: number = 4`        | `TournamentDTO`                              | Creates tournament (rejects if one is already active/waiting)           |
| `registerUserToTournament()`      | `tournamentId: number`, `userId: number`        | `number` (player row ID)                     | Validates state/slots and registers player                              |
| `startTournament()`               | `tournamentId: number`                          | `TournamentDTO \| null`                      | Shuffles players, creates first-round matches, sets state to "active"   |
| `recordMatchResult()`             | `matchId: number`, `winnerId: number`           | `MatchDTO`                                   | Validates winner and records the result                                 |
| `advanceRound()`                  | `tournamentId: number`                          | `TournamentDTO \| null`                      | Checks round complete → pairs winners → creates next round matches      |
| `getActiveTournament()`           | none                                            | `TournamentDTO \| null`                      | Wrapper for repo function                                               |
| `getTournament()`                 | `tournamentId: number`                          | `TournamentDTO \| null`                      | Wrapper for repo function                                               |