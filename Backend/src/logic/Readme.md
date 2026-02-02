# Matchmaking & Tournament Systems – How They Work

## 1. Connect4 Matchmaking System

### Purpose
Real-time 1v1 matchmaking for Connect4 with automatic cleanup of abandoned games and queue entries.

### Key Principles
- **Database-backed** — no fragile in-memory timeouts or localStorage
- Matchmaking state lives in `matchmaking_queue` and `active_matches`
- **Automatic timeout cleanup** runs on every poll
- Results are recorded in `match` and `match_players`

### Simple Flow Explanation
A player clicks "Play" → joins the queue.
The system tries to pair them with another waiting player.
If a pair is found, a new active match is created with status `matched`.
Clients poll for state; each poll triggers cleanup of expired queue entries and matches.
When the game starts, status becomes `started`.
When the game ends, the winner is recorded and the active match is deleted.

### API Endpoints (used by frontend)

| Endpoint                          | Method | Purpose                                      |
|-----------------------------------|--------|----------------------------------------------|
| `/api/matchmaking/join`           | POST   | Player joins the Connect4 queue              |
| `/api/matchmaking/start`          | POST   | Sets match status to `started`               |
| `/api/matchmaking/finish`         | POST   | Records winner + cleans up active match      |
| `/api/matchmaking/state/:userId`  | GET    | Poll: returns queued/active/idle state       |

### Main Queries (match.repo.ts)

| Function                          | Purpose                                                                 |
|-----------------------------------|-------------------------------------------------------------------------|
| `enqueuePlayer()`                 | Insert or refresh a player in queue                                     |
| `dequeueTwoPlayers()`             | Cleanup queue + return oldest two players (or null)                     |
| `cleanupQueue()`                  | Remove expired queue entries                                            |
| `insertActiveMatch()`             | Create a new active match (status `matched`)                            |
| `updateActiveMatchStatus()`       | Update status and set `started_at`                                      |
| `deleteActiveMatch()`             | Remove finished/expired match                                           |
| `getActiveMatchFull()`            | Fetch full active match with player names                               |
| `getExpiredActiveMatches()`       | Find matched/started games past their timeout                           |
| `recordConnect4Game()`            | Insert finished match + match_players                                   |

### Main Functions (matchmakingManager.ts)

| Function                          | Purpose                                                                 |
|-----------------------------------|-------------------------------------------------------------------------|
| `joinQueue()`                     | Validate, enqueue, try to pair, create match                            |
| `getActiveMatchForUser()`         | Cleanup + return user's active match                                    |
| `isQueued()`                      | Cleanup + check if user is in queue                                     |
| `startMatch()`                    | Validate and transition to `started`                                    |
| `finishMatch()`                   | Record result and clean up                                              |

---

## 2. Pong Tournament System

### Purpose
Admin-controlled single-elimination tournament for Pong with support for 4 or 8 players, registration phase, automatic bracket generation, and manual round progression.

### Key Principles
- **Fully persistent** — tournament state, registrations, matches, and results stored in the database
- **Direct result reporting** from the Pong game page
- Manual round advancement gives the admin full control and visibility

### Simple Flow Explanation
An admin creates a new tournament (only one active/waiting at a time).
Players register until the tournament is full.
The admin starts the tournament → players are shuffled and first-round matches are created.
Players can start only their own match.
When a Pong game ends, the winner is reported to the backend API.
Once all matches in the current round are finished, the admin advances to the next round.
This continues until a final winner is determined and the tournament becomes `finished`.

### API Endpoints (used by frontend)

| Endpoint                          | Method | Purpose                                      |
|-----------------------------------|--------|----------------------------------------------|
| `/api/tournament/create`          | POST   | Admin creates a new tournament               |
| `/api/tournament/register`        | POST   | Player registers for the current tournament  |
| `/api/tournament/start`           | POST   | Admin starts the tournament (must be full)   |
| `/api/tournament/result`          | POST   | Pong game reports the winner of a match      |
| `/api/tournament/next`            | POST   | Admin advances to the next round             |
| `/api/tournament/get`             | POST   | Fetch tournament by ID                       |
| `/api/tournament/active`          | GET    | Returns the current waiting/active tournament|

### Main Queries (tournamentRepo.ts)

| Function                          | Purpose                                                                 |
|-----------------------------------|-------------------------------------------------------------------------|
| `insertTournament()`              | Insert new tournament row                                               |
| `insertTournamentPlayer()`        | Insert player into tournament_players                                   |
| `insertMatch()`                   | Create match + link to tournament                                       |
| `recordMatchWinner()`             | Update the match row with winner_id                                     |
| `updateTournamentState()`         | Update state/round/winner                                               |
| `getRegisteredPlayers()`          | Return registered players                                               |
| `getMatchDTO()`                   | Build match object with players                                         |
| `getActiveTournament()`           | Return single waiting/active tournament                                 |
| `getTournamentWithMatches()`      | Build full tournament DTO                                               |

### Main Functions (tournamentManager.ts)

| Function                          | Purpose                                                                 |
|-----------------------------------|-------------------------------------------------------------------------|
| `createTournament()`              | Create tournament (rejects if one already active/waiting)               |
| `registerUserToTournament()`      | Validate state/slots and register player                                |
| `startTournament()`               | Shuffle players, create first round, set state to `active`              |
| `recordMatchResult()`             | Validate winner and record result                                       |
| `advanceRound()`                  | Check round completion → create next round matches                      |
| `getActiveTournament()`           | Wrapper for repo function                                               |
| `getTournament()`                 | Wrapper for repo function                                               |
