Roles

	Admin: Can create a tournament and start it (only if the required number of players is registered). Only one tournament can exist at a time.
	User: Must log in first. Can register to a pending tournament if there are free spots.

Tournament Start Page (start.tsx)

	Shows available tournaments (max one at a time).
	Admin sees “Create Tournament” + “Start Tournament” buttons.
	Users see “Join Tournament” if there’s an open spot.
	Choice between 4-player or 8-player tournament.

Tournament Active Page (active.tsx)

	Shows matches for the signed-in user (both p1 and p2 matches where user ID matches).
	User clicks “Start Game” only for their own match.
	Only one player in the match can start the game. The other waits.
	After finishing the game, the result is submitted to the backend.
	If all matches in a round are finished → admin can advance to next round.

