import { getAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";
import { useState, useEffect, navigate } from "Reactor"
import { vTournamentName } from "@/core/lib/input/validators";
import { unwrap } from "@/core/lib/input/unwrap";


export default function TournamentPage() {
	const auth = getAuth();
	const user = auth?.user;

	const [tournament, setTournament] = useState(null);
	const [max_players, setMax_players] = useState(4);
	const [tournamentNameRaw, setTournamentName] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const isAdmin = user?.isAdmin || false;

	useEffect(() => {
		if (!user) return;

		let mounted = true;

		const loadTournament = async () => {
			setLoading(true);
			try {
				const res = await apiFetch("/api/tournament/active");
				if (res.ok) {
					const data = await res.json();
					setTournament(data.tournament);
				} else {
					setTournament(null);
					setError("Failed to load tournament");
				}
			} catch (err) {
				setTournament(null);
				setError("Network error");
			} finally {
				if (mounted) setLoading(false);
			}
		};

		loadTournament();
		return () => { mounted = false; };
	}, []);

	const refreshTournament = async () => {
		try {
			const res = await apiFetch("/api/tournament/active");
			const data = await res.json();
			if (data.success) setTournament(data.tournament);
		} catch { }
	};

	const handleCreateTournament = async () => {
		if (max_players === 0) {
			setError("Please select number of players");
			return;
		}
		let name: string;
		try {
			name = unwrap(vTournamentName(tournamentNameRaw));
		} catch (e: any) {
			setError(e.message);
			return;
		}

		try {
			const res = await apiFetch("/api/tournament/create", {
				method: "POST",
				body: JSON.stringify({ name, max_players }),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.error || "Failed to create tournament");
				return;
			}
			setTournament(data.tournament);
			setError("");
		} catch {
			setError("Network error creating tournament");
		}
	};

	const handleRegister = async () => {
		if (!tournament) return;
		try {
			const res = await apiFetch("/api/tournament/register", {
				method: "POST",
				body: JSON.stringify({ tournamentId: tournament.id }),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.error || "Failed to register");
				return;
			}
			setError("");
			await refreshTournament();
		} catch {
			setError("Network error registering");
		}
	};

	const handleStartTournament = async () => {
		if (!tournament) return;
		try {
			const res = await apiFetch("/api/tournament/start", {
				method: "POST",
				body: JSON.stringify({ tournamentId: tournament.id }),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.error || "Failed to start tournament");
				return;
			}
			setTournament(data.tournament);
			setError("");
		} catch {
			setError("Network error starting tournament");
		}
	};

	// Login prompt
	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center p-8">
				<div className="panel-surface relative w-full max-w-lg p-10 rounded-2xl backdrop-blur-xl">
					{/* Accent top line */}
					<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60 rounded-t-2xl" />
					<div className="flex flex-col items-center gap-6 text-center">
						<div className="w-20 h-20 rounded-full bg-surface border border-accent/30 flex items-center justify-center" style={{ boxShadow: 'var(--glow-medium)' }}>
							<span className="icon-[solar--cup-star-bold-duotone] text-4xl text-accent" />
						</div>
						<div>
							<p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent/70 mb-2">Arena Protocol</p>
							<h1 className="text-3xl font-black text-white tracking-tight">Tournament Arena</h1>
						</div>
						<p className="text-lg text-gray-400">Please login to join tournament.</p>
						<button onClick={() => navigate("/auth/login")} className="btn btn-primary btn-lg mt-4">
							Go to Login
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Loading
	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-6">
				<div className="w-14 h-14 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
				<p className="text-lg text-gray-400">Loading tournament...</p>
			</div>
		);
	}

	const isRegistered = tournament?.registeredPlayers?.some((p: any) => p.id === user.id);
	const canRegister = !isAdmin && tournament?.state === "waiting" && !isRegistered &&
		(tournament.registeredPlayers?.length || 0) < (tournament?.max_players ?? max_players);
	const isFull = (tournament?.registeredPlayers?.length || 0) >= (tournament?.max_players ?? max_players);

	return (
		<div className="min-h-screen text-white">
			{/* Scanline overlay */}
			<div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]" />

			{/* Main content */}
			<div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
				{/* Header */}
				<div className="mb-12 text-center md:text-left">
					<div className="flex flex-col md:flex-row items-center gap-6 mb-6">
						<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-950/80 to-purple-950/50 border border-accent/30 flex items-center justify-center" style={{ boxShadow: 'var(--glow-medium)' }}>
							<span className="icon-[solar--cup-star-bold-duotone] text-4xl text-accent" />
						</div>
						<div>
							<p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent/70 mb-1">Arena Protocol</p>
							<h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
								{tournament ? tournament.name : "Tournament Arena"}
							</h1>
							{tournament && (
								<div className="flex items-center gap-3 mt-3">
									<span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${tournament.state === 'waiting' ? 'bg-amber-950/50 text-amber-400 border border-amber-500/30' :
											tournament.state === 'active' ? 'bg-green-950/50 text-green-400 border border-green-500/30' :
												'bg-gray-800 text-gray-400 border border-gray-700'
										}`}>
										<span className={`w-2 h-2 rounded-full animate-pulse ${tournament.state === 'waiting' ? 'bg-amber-400' :
												tournament.state === 'active' ? 'bg-green-400' : 'bg-gray-500'
											}`} />
										{tournament.state}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Error */}
				{error && (
					<div className="mb-8 flex items-center gap-4 px-5 py-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400">
						<span className="icon-[solar--danger-triangle-bold-duotone] text-2xl flex-shrink-0" />
						<span>{error}</span>
					</div>
				)}

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left: Action Card */}
					<div className="panel-surface relative overflow-hidden rounded-2xl backdrop-blur-md p-8">
						{/* Accent top line */}
						<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

						{/* Admin: Create Tournament */}
						{!tournament && isAdmin && (
							<div className="space-y-6">
								<div className="flex items-center gap-3 mb-6">
									<span className="icon-[solar--add-circle-bold-duotone] text-2xl text-accent" />
									<h2 className="text-xl font-bold text-white">Create Tournament</h2>
								</div>

								<div className="space-y-2">
									<label className="block text-[11px] font-semibold tracking-wide uppercase text-gray-400">
										Tournament Name
									</label>
									<input
										type="text"
										placeholder="Enter a name..."
										value={tournamentNameRaw}
										onChange={e => setTournamentName(e.target.value)}
										className="w-full px-4 py-3 bg-surface border border-border-soft rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-surface-strong transition-all"
									/>
								</div>

								<div className="space-y-2">
									<label className="block text-[11px] font-semibold tracking-wide uppercase text-gray-400">
										Max Players
									</label>
									<div className="flex gap-3">
										{[4, 8].map(num => (
											<button
												key={num}
												onClick={() => setMax_players(num)}
												className={`flex-1 py-3 px-4 rounded-xl text-lg font-bold transition-all ${max_players === num
														? 'bg-accent text-black'
														: 'bg-surface text-gray-400 border border-border-soft hover:bg-surface-strong hover:text-white'
													}`}
												style={max_players === num ? { boxShadow: 'var(--glow-medium)' } : {}}
											>
												{num} Players
											</button>
										))}
									</div>
								</div>

								<button onClick={handleCreateTournament} className="btn btn-primary btn-lg w-full mt-6">
									<span className="icon-[solar--cup-star-bold] mr-2" />
									Initialize Tournament
								</button>
							</div>
						)}

						{/* No tournament & not admin */}
						{!tournament && !isAdmin && (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<span className="icon-[solar--ghost-smile-bold-duotone] text-6xl text-gray-600 mb-6" />
								<p className="text-xl text-gray-400 font-medium">No Tournament Available</p>
								<p className="text-sm text-gray-500 mt-2">Check back later or wait for an admin to create one.</p>
							</div>
						)}

						{/* Tournament exists */}
						{tournament && (
							<div className="space-y-6">
								<div className="flex items-center gap-3 mb-4">
									<span className="icon-[solar--info-circle-bold-duotone] text-2xl text-accent" />
									<h2 className="text-xl font-bold text-white">Tournament Info</h2>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="p-4 bg-surface rounded-xl border border-border-soft">
										<p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Registered</p>
										<p className="text-2xl font-bold text-accent">
											{tournament.registeredPlayers?.length || 0}
											<span className="text-gray-500">/{tournament?.max_players ?? max_players}</span>
										</p>
									</div>
									<div className="p-4 bg-surface rounded-xl border border-border-soft">
										<p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Format</p>
										<p className="text-2xl font-bold text-white">{tournament?.max_players ?? max_players}P</p>
									</div>
								</div>

								{/* Actions */}
								<div className="pt-4 space-y-3">
									{isAdmin && tournament.state === "waiting" && isFull && (
										<button onClick={handleStartTournament} className="btn btn-primary btn-lg w-full">
											<span className="icon-[solar--play-bold] mr-2" />
											Start Tournament
										</button>
									)}

									{canRegister && (
										<button onClick={handleRegister} className="btn btn-success btn-lg w-full">
											<span className="icon-[solar--user-plus-bold] mr-2" />
											Join Tournament
										</button>
									)}

									{!isRegistered && !isAdmin && tournament.state === "waiting" && isFull && (
										<div className="text-center py-4 text-amber-400 font-medium">
											<span className="icon-[solar--lock-bold] mr-2" />
											Tournament is full
										</div>
									)}

									{isRegistered && tournament.state === "waiting" && (
										<div className="text-center py-4 text-accent font-medium">
											<span className="icon-[solar--check-circle-bold] mr-2" />
											You are registered!
										</div>
									)}

									{tournament.state !== "waiting" && (
										<div className="p-4 bg-green-950/30 border border-green-500/30 rounded-xl text-center">
											<p className="text-green-400 font-semibold mb-2">
												<span className="icon-[solar--play-circle-bold] mr-2" />
												Tournament is active!
											</p>
											{isRegistered && (
												<button
													onClick={() => navigate("/tournament/active")}
													className="text-sm text-green-300 hover:text-green-200 underline underline-offset-2"
												>
													View your matches →
												</button>
											)}
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Right: Players List */}
					<div className="panel-surface relative overflow-hidden rounded-2xl backdrop-blur-md p-8">
						{/* Purple accent top line */}
						<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />

						<div className="flex items-center gap-3 mb-6">
							<span className="icon-[solar--users-group-rounded-bold-duotone] text-2xl text-purple-400" />
							<h2 className="text-xl font-bold text-white">Registered Players</h2>
							{tournament && (
								<span className="ml-auto text-sm text-gray-500">
									{tournament.registeredPlayers?.length || 0} / {tournament?.max_players ?? max_players}
								</span>
							)}
						</div>

						{!tournament || !tournament.registeredPlayers?.length ? (
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<span className="icon-[solar--users-group-rounded-line-duotone] text-5xl text-gray-700 mb-4" />
								<p className="text-gray-500">No players registered yet</p>
							</div>
						) : (
							<div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
								{tournament.registeredPlayers.map((p: any, i: number) => (
									<div
										key={p.id}
										className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border-soft hover:bg-surface-strong transition-colors group"
									>
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-border-strong flex items-center justify-center text-accent font-bold">
											{i + 1}
										</div>
										<div className="flex-1">
											<p className="font-semibold text-white group-hover:text-accent transition-colors">{p.name}</p>
											<p className="text-xs text-gray-500">Player #{p.id}</p>
										</div>
										{p.id === user.id && (
											<span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-cyan-950/50 text-accent rounded-full border border-accent/30">
												You
											</span>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}