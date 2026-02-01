import { getAuth } from "@/core/lib/auth";
import { apiFetch } from "@/core/lib/api";
import { useState, useEffect, navigate } from "Reactor"
import { vTournamentName } from "@/core/lib/input/validators";
import { unwrap } from "@/core/lib/input/unwrap";
import UserAvatar from "@/app/components/ui/UserAvatar";


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
		if (!tournament || !isAdmin) return;
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
			<div className="min-h-screen flex items-center justify-center p-6 bg-gray-950">
				<div className="panel-surface relative w-full max-w-lg p-10 rounded-3xl backdrop-blur-2xl border border-white/5 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-cyan-900/10" />
					<div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

					<div className="relative flex flex-col items-center gap-8 text-center z-10">
						<div className="w-24 h-24 rounded-full bg-surface border border-cyan-500/20 flex items-center justify-center relative group">
							<div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-pulse" />
							<span className="icon-[solar--cup-star-bold-duotone] text-5xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
						</div>

						<div className="space-y-2">
							<p className="text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-400/60">Restricted Access</p>
							<h1 className="text-4xl font-black text-white tracking-tight">Arena Protocol</h1>
							<p className="text-lg text-gray-400 max-w-xs mx-auto">Authentication required to enter tournament grounds.</p>
						</div>

						<button
							onClick={() => navigate("/auth/login")}
							className="btn-hero btn-lg w-full group relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
							<span className="icon-[solar--login-3-bold] mr-2" />
							Authenticate
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Loading
	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-950">
				<div className="relative">
					<div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]" />
					</div>
				</div>
				<p className="text-lg text-cyan-400/60 font-mono tracking-widest animate-pulse">INITIALIZING...</p>
			</div>
		);
	}

	const isRegistered = tournament?.registeredPlayers?.some((p: any) => p.id === user.id);
	const canRegister = !isAdmin && tournament?.state === "waiting" && !isRegistered &&
		(tournament.registeredPlayers?.length || 0) < (tournament?.max_players ?? max_players);
	const isFull = (tournament?.registeredPlayers?.length || 0) >= (tournament?.max_players ?? max_players);

	return (
		<div className="min-h-screen text-white bg-gray-950 pb-20 selection:bg-cyan-500/30">
			{/* Scanline & Ambient background */}
			<div className="fixed inset-0 pointer-events-none z-0">
				<div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_1px]" />
				<div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
				<div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full" />
			</div>

			<div className="max-w-7xl mx-auto px-6 md:px-12 py-12 relative z-10">

				{/* Hero Header */}
				<header className="mb-16 relative">
					<div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500" />
							<div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center relative z-10 shadow-2xl">
								<span className="icon-[solar--cup-star-bold-duotone] text-5xl md:text-6xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
							</div>
						</div>

						<div className="space-y-4 flex-1">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-400 mb-2">
								<span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
								System Online
							</div>
							<h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
								{tournament ? tournament.name : "Tournament Arena"}
							</h1>

							{tournament && (
								<div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
									<div className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${tournament.state === 'waiting'
										? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
										: tournament.state === 'active'
											? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
											: 'bg-gray-800/50 border-gray-700 text-gray-400'
										}`}>
										<span className={`w-2 h-2 rounded-full animate-pulse ${tournament.state === 'waiting' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' :
											tournament.state === 'active' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gray-400'
											}`} />
										<span className="font-bold uppercase tracking-wider text-sm">{tournament.state}</span>
									</div>
									<div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-mono text-sm">
										<span className="icon-[solar--hashtag-square-bold] mr-2 opacity-50" />
										ID: {tournament.id}
									</div>
								</div>
							)}
						</div>
					</div>
				</header>

				{/* Error Toast */}
				{error && (
					<div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
						<div className="flex items-center gap-4 px-6 py-4 bg-red-950/90 border border-red-500/30 rounded-2xl text-red-200 shadow-2xl backdrop-blur-xl">
							<span className="icon-[solar--danger-triangle-bold-duotone] text-2xl animate-bounce" />
							<span className="font-medium">{error}</span>
							<button onClick={() => setError("")} className="ml-2 hover:bg-white/10 p-1 rounded-lg transition-colors">
								<span className="icon-[solar--close-circle-bold] text-xl" />
							</button>
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

					{/* LEFT COLUMN: Main Action Panel */}
					<div className="lg:col-span-7 space-y-8">

						{/* Admin Create Panel */}
						{!tournament && isAdmin && (
							<div className="panel-surface panel-surface--heavy relative overflow-hidden rounded-3xl p-8 md:p-10 group">
								<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

								<div className="flex items-center gap-4 mb-8">
									<div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
										<span className="icon-[solar--add-circle-bold-duotone] text-3xl text-cyan-400" />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-white">Initialize Event</h2>
										<p className="text-gray-400 text-sm">Configure new tournament parameters</p>
									</div>
								</div>

								<div className="space-y-8">
									<div className="space-y-3">
										<label className="text-xs font-bold tracking-widest uppercase text-gray-500">Event Designation</label>
										<div className="relative">
											<input
												type="text"
												placeholder="Enter tournament name..."
												value={tournamentNameRaw}
												onChange={e => setTournamentName(e.target.value)}
												className="w-full pl-5 pr-4 py-4 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-gray-900/80 transition-all font-medium text-lg"
											/>
											<div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
												<span className="icon-[solar--pen-new-square-linear] text-xl" />
											</div>
										</div>
									</div>

									<div className="space-y-3">
										<label className="text-xs font-bold tracking-widest uppercase text-gray-500">Bracket Size</label>
										<div className="grid grid-cols-2 gap-4">
											{[4, 8].map(num => (
												<button
													key={num}
													onClick={() => setMax_players(num)}
													className={`relative py-4 px-6 rounded-xl border-2 transition-all duration-300 group/btn ${max_players === num
														? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
														: 'bg-gray-900/30 border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'
														}`}
												>
													<div className="flex flex-col items-center gap-2">
														<span className="text-3xl font-black">{num}</span>
														<span className="text-[10px] font-bold uppercase tracking-widest">Contenders</span>
													</div>
													{max_players === num && (
														<span className="absolute top-2 right-2 icon-[solar--check-circle-bold] text-cyan-400" />
													)}
												</button>
											))}
										</div>
									</div>

									<div className="pt-4">
										<button onClick={handleCreateTournament} className="btn-hero btn-xl w-full">
											<span className="icon-[solar--cup-star-bold] mr-3" />
											Create Tournament
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Empty State (Non-Admin) */}
						{!tournament && !isAdmin && (
							<div className="space-y-4">
								<div className="panel-surface rounded-3xl p-12 text-center border border-white/5 bg-white/[0.02]">
									<div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6 opacity-50">
										<span className="icon-[solar--ghost-smile-bold-duotone] text-5xl text-gray-400" />
									</div>
									<h2 className="text-2xl font-bold text-white mb-2">No Active Events</h2>
									<p className="text-gray-400 max-w-sm mx-auto">The arena is currently silent.</p>
								</div>

								{/* Admin Create Notification */}
								<div className="panel-surface p-6 rounded-2xl bg-gradient-to-br from-purple-900/10 to-gray-900/30 border border-purple-500/10 flex items-center gap-5">
									<div className="relative shrink-0">
										<div className="w-12 h-12 rounded-full bg-gray-900 border border-purple-500/30 flex items-center justify-center">
											<span className="icon-[solar--shield-user-bold-duotone] text-2xl text-purple-400" />
										</div>
									</div>
									<div className="flex-1">
										<p className="text-xs text-purple-300/60 font-mono mb-1">SYSTEM PROTOCOL</p>
										<p className="text-sm text-gray-400">
											Event initialization is restricted to <span className="text-purple-300 font-bold">Administrators</span>.
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Active Tournament Actions & Stats */}
						{tournament && (
							<div className="space-y-6">
								{/* Stats Cards */}
								<div className="grid grid-cols-2 gap-4">
									<div className="panel-surface p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-white/5 backdrop-blur-md">
										<p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70 mb-1">Registration</p>
										<div className="flex items-baseline gap-2">
											<span className="text-3xl font-black text-white">{tournament.registeredPlayers?.length || 0}</span>
											<span className="text-sm text-gray-500 font-medium">/ {tournament?.max_players ?? max_players}</span>
										</div>
										<div className="w-full bg-gray-800 h-1.5 mt-3 rounded-full overflow-hidden">
											<div
												className="h-full bg-cyan-400 transition-all duration-1000 ease-out"
												style={{ width: `${((tournament.registeredPlayers?.length || 0) / (tournament?.max_players ?? max_players)) * 100}%` }}
											/>
										</div>
									</div>
									<div className="panel-surface p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-white/5 backdrop-blur-md">
										<p className="text-[10px] font-bold uppercase tracking-widest text-purple-400/70 mb-1">Format</p>
										<div className="flex items-center gap-2">
											<span className="icon-[solar--sitemap-bold-duotone] text-2xl text-purple-400" />
											<span className="text-xl font-bold text-white">Single Elim</span>
										</div>
										<p className="text-[10px] text-gray-500 mt-2 font-mono">CLASSIC BRACKET SYSTEM</p>
									</div>
								</div>

								{/* Interaction Panel */}
								<div className="panel-surface rounded-3xl p-8 relative overflow-hidden">
									{/* Waiting State Actions */}
									{tournament.state === "waiting" && (
										<div className="space-y-4">
											{isAdmin && isFull && (
												<button onClick={handleStartTournament} className="btn-hero btn-xl w-full animate-pulse-slow">
													<div className="absolute inset-0 bg-white/20 blur opacity-0 hover:opacity-100 transition-opacity" />
													<span className="icon-[solar--play-circle-bold] mr-3" />
													Launch Tournament
												</button>
											)}

											{canRegister && (
												<div className="space-y-4">
													<button onClick={handleRegister} className="group relative w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.4)]">
														<div className="flex items-center justify-center gap-3">
															<span className="icon-[solar--user-plus-bold] text-2xl group-hover:rotate-12 transition-transform" />
															JOIN COMBAT
														</div>
													</button>

													{/* Admin Start Info */}
													<div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
														<span className="icon-[solar--shield-warning-bold] text-purple-400" />
														<span>Waiting for Admin to launch</span>
													</div>
												</div>
											)}

											{!isAdmin && isFull && (
												<div className="space-y-4">
													<div className="flex items-center justify-center gap-3 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
														<span className="icon-[solar--lock-keyhole-bold-duotone] text-2xl" />
														<span className="font-bold tracking-wide">REGISTRATION CLOSED - FULL CAPACITY</span>
													</div>

													{/* Admin Start Notification Card */}
													<div className="panel-surface p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-gray-900/50 border border-purple-500/30 flex items-center gap-5 relative overflow-hidden">
														<div className="absolute inset-0 bg-[url('/assets/pattern-grid.svg')] opacity-5" />

														{/* Admin Avatar Visual */}
														<div className="relative shrink-0">
															<div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-purple-400 flex items-center justify-center relative z-10 overflow-hidden">
																<span className="icon-[solar--shield-user-bold-duotone] text-4xl text-purple-400" />
															</div>
															{/* Pulse Effect */}
															<div className="absolute inset-0 rounded-full bg-purple-500/30 blur-md animate-pulse" />
															<div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-700">
																<span className="icon-[solar--verified-check-bold] text-purple-400 text-sm" />
															</div>
														</div>

														<div className="relative z-10 flex-1">
															<h3 className="text-lg font-bold text-white mb-1">Awaiting Authorization</h3>
															<p className="text-sm text-gray-400 leading-relaxed">
																Tournament start sequence restricted to <span className="text-purple-300 font-medium">Administrators</span>.
																System is standby for command.
															</p>
														</div>
													</div>
												</div>
											)}

											{isRegistered && (
												<div className="space-y-4">
													<div className="flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-emerald-900/20 to-gray-900/50 border border-emerald-500/30 rounded-2xl text-emerald-400 relative overflow-hidden">
														<div className="absolute inset-0 bg-[url('/assets/pattern-grid.svg')] opacity-10" />
														<div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
															<span className="icon-[solar--check-circle-bold] text-3xl text-emerald-400" />
														</div>
														<div className="text-center z-10">
															<h3 className="text-xl font-bold text-white">Registration Confirmed</h3>
															<p className="text-emerald-400/70 text-sm mt-1">Ready for deployment.</p>
														</div>
													</div>

													{/* Sticky Admin Notification for Registered Users */}
													<div className="panel-surface p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-4">
														<div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
															<span className="icon-[solar--shield-user-bold-duotone] text-xl text-purple-400" />
														</div>
														<p className="text-xs text-purple-200/80 leading-relaxed">
															<span className="font-bold text-purple-300">Admin Clearance Required</span><br />
															Waiting for an Administrator to initiate the match sequence.
														</p>
													</div>
												</div>
											)}
										</div>
									)}

									{/* Active State Actions */}
									{tournament.state !== "waiting" && (
										<div className="text-center space-y-6">
											<div className="inline-flex flex-col items-center">
												<div className="w-20 h-20 relative mb-4">
													<div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse" />
													<span className="icon-[solar--play-circle-bold-duotone] text-7xl text-emerald-400 relative z-10" />
												</div>
												<h3 className="text-2xl font-bold text-white">Tournament In Progress</h3>
												<p className="text-gray-400">Live matches are currently underway</p>
											</div>

											{isRegistered && (
												<button
													onClick={() => navigate("/tournament/active")}
													className="btn-primary btn-lg w-full"
												>
													<span className="icon-[solar--gamepad-bold] mr-2" />
													Enter Match Lobby
												</button>
											)}

											{!isRegistered && (
												<button
													onClick={() => navigate("/tournament/active")}
													className="btn-glass btn-lg w-full"
												>
													<span className="icon-[solar--eye-bold] mr-2" />
													Spectate Matches
												</button>
											)}
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* RIGHT COLUMN: Player List */}
					<div className="lg:col-span-12 xl:col-span-5 h-full">
						<div className="panel-surface relative h-full min-h-[500px] rounded-3xl p-0 overflow-hidden flex flex-col">
							{/* Header */}
							<div className="p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm sticky top-0 z-20">
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-bold text-white flex items-center gap-3">
										<span className="icon-[solar--users-group-rounded-bold-duotone] text-purple-400 text-xl" />
										Roster
									</h2>
									<span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold rounded-lg uppercase tracking-wider">
										{tournament ? `${tournament.registeredPlayers?.length || 0} / ${tournament.max_players ?? max_players}` : "Offline"}
									</span>
								</div>
							</div>

							{/* List */}
							<div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
								{!tournament || !tournament.registeredPlayers?.length ? (
									<div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
										<span className="icon-[solar--user-block-rounded-linear] text-6xl mb-4" />
										<p className="font-mono text-sm">NO SIGNALS DETECTED</p>
									</div>
								) : (
									tournament.registeredPlayers.map((p: any, i: number) => (
										<div
											key={p.id}
											className={`group flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${p.id === user.id
												? 'bg-cyan-500/10 border-cyan-500/30 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]'
												: 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20'
												}`}
										>
											<div className="relative">
												<UserAvatar
													userId={p.id}
													username={p.name}
													size="md"
													className={`border-2 ${p.id === user.id ? 'border-cyan-400' : 'border-gray-700 group-hover:border-gray-500'}`}
												/>
												<div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] z-10 ${p.id === user.id
													? 'bg-cyan-500 text-black border border-cyan-400'
													: 'bg-gray-800 text-gray-400 border border-white/10'
													}`}>
													{i + 1}
												</div>
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<p className={`font-bold truncate ${p.id === user.id ? 'text-cyan-400' : 'text-gray-200 group-hover:text-white'}`}>
														{p.name}
													</p>
													{p.id === user.id && (
														<span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-300 uppercase leading-none">
															You
														</span>
													)}
												</div>
												<p className="text-[10px] text-gray-500 font-mono">OPERATOR ID: {p.id.toString().padStart(4, '0')}</p>
											</div>

											{p.id === user.id && (
												<div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
											)}
										</div>
									))
								)}
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}