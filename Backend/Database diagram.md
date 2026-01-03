+-------------------+            +--------------------+
|      users        |            |     tournaments    |
|-------------------|            |--------------------|
| id (PK)           |            | id (PK)            |
| username          |            | name               |
| ...               |            | created_at         |
+---------+---------+            +---------+----------+
          ^                                ^
          |                                |
          |                                |
          |                   +-------------+-------------+
          |                   |                           |
          |                   |                           |
+---------+----------+   +-----+--------------------+ +---+---------------------+
| tournament_players |   |    tournament_matches    | |        matches          |
|---------------------|  |--------------------------| |--------------------------|
| id (PK)             |  | id (PK)                  | | id (PK)                 |
| tournament_id (FK)--+->| tournament_id (FK)       | | created_at              |
| user_id (FK) -------+   | match_id (FK)----------+->| finished_at             |
| alias               |   | round_number            | | winner_id (FK → users)  |
| joined_at           |   | match_number_in_round   | | ai_difficulty           |
| UNIQUE(tournament_id,   | next_tournament_match   | | is_ai_game              |
|        user_id)          +------------------------+  +-------+----------------+
+----------------------+                                     |
                                                             |
                                                             v
                                            +----------------+---------------+
                                            |             match_players      |
                                            |--------------------------------|
                                            | id (PK)                        |
                                            | match_id (FK → matches.id)     |
                                            | user_id (FK → users.id)        |
                                            | score                          |
                                            | is_winner                      |
                                            +--------------------------------+


PK -> Primary Key = Unique, Not NULL
FK -> Foreign Key = This value must match a primary key from another table. SQL prevents inserting invalid references