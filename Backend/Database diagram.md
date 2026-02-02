# Database Diagram (Prisma)

```
+-------------------+          +--------------------+
|      users        |          |    user_session    |
|-------------------|          |--------------------|
| id (PK)           |<---------| user_id (FK)       |
| email (U)         |          | token (U)          |
| username (U)      |          | created_at         |
| password_hash     |          | expires_at         |
| isAdmin           |          +--------------------+
| avatarId (FK)     |
| created_at        |          +--------------------+
| updated_at        |<---------|      avatar        |
+---------+---------+          |--------------------|
          ^                    | id (PK)            |
          |                    | user_id (FK)       |
          |                    | file_path          |
          |                    | is_default         |
          |                    +--------------------+
          |
          |                    +--------------------+
          |<-------------------|      friends       |
          |                    |--------------------|
          |                    | id (PK)            |
          |                    | user_id (FK)       |
          |                    | friend_id (FK)     |
          |                    | status             |
          |                    +--------------------+
          |
          |                    +--------------------+
          |<-------------------|     stats_user     |
          |                    |--------------------|
          |                    | user_id (PK/FK)    |
          |                    | wins/losses/etc    |
          |                    +--------------------+

+-------------------+          +--------------------+
|       match       |          |   match_players    |
|-------------------|<---------| match_id (FK)      |
| id (PK)           |          | user_id (FK)       |
| created_at        |          | score              |
| finished_at       |          | is_winner          |
| winner_id (FK)    |          +--------------------+
| ai_difficulty     |
| is_ai_game        |
| game_name         |
+---------+---------+
          ^
          |
+---------+---------+          +--------------------+
|   tournament_match|<---------|     tournaments    |
|-------------------|          |--------------------|
| id (PK)           |          | id (PK)            |
| tournament_id (FK)|          | state              |
| match_id (FK)     |          | current_round      |
| round_number      |          | max_players        |
| next_match_id (FK)|          | winner_id (FK)     |
+---------+---------+          +--------------------+
          ^
          |
+---------+---------+
| tournament_player |
|-------------------|
| id (PK)           |
| tournament_id (FK)|
| user_id (FK)      |
| alias             |
| joined_at         |
+-------------------+

+--------------------+         +--------------------+
|  matchmaking_queue |         |   active_matches   |
|--------------------|         |--------------------|
| id (PK)            |         | match_id (PK)      |
| user_id (FK)       |         | game_name          |
| game_name          |         | p1_id (FK)         |
| joined_at          |         | p2_id (FK)         |
+--------------------+         | status             |
                               | created_at         |
                               | started_at         |
                               +--------------------+
```

Legend:
- PK = Primary Key
- FK = Foreign Key
- U = Unique
