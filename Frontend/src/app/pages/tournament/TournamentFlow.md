Roles

	Admin: Can create a tournament and start it (only if the required number of players is registered). Only one tournament can exist at a time.
	User: Must log in first. Can register to a pending tournament if there are free spots.

Tournament Start Page (start.tsx)

	Shows the active tournament (max one at a time).
	Admin sees “Create Tournament” + “Start Tournament” buttons.
	Users see “Join Tournament” if there’s an open spot.
	Admin can choose between 4-player or 8-player bracket size.

Tournament Active Page (active.tsx)

	Shows matches for the signed-in user (p1 or p2).
	Either player can start their own match.
	After finishing the game, the result is submitted to the backend.
	If all matches in a round are finished → admin can advance to next round.
