import { navigate, useEffect, useRef } from 'Reactor';
import { animate } from 'motion';
import { apiFetch } from "@/core/lib/api";
import { useScreen } from "@/app/hooks/useScreen";
import Button from "@/app/components/ui/Button";

// Ball Chaos Arena - Bouncing balls with wall deflection and trails
function BallChaosArena() {
	const containerRef = useRef<HTMLDivElement>(null);
	const ballRefs = [
		useRef<HTMLDivElement>(null),
		useRef<HTMLDivElement>(null),
		useRef<HTMLDivElement>(null),
		useRef<HTMLDivElement>(null)
	];

	// Ball config (outside useEffect so JSX can access sizes)
	const ballConfigs = [
		{ size: 12 },
		{ size: 14 },
		{ size: 10 },
		{ size: 12 }
	];

	useEffect(() => {

		const container = containerRef.current;
		if (!container) return;

		// Ball state: position & velocity + squeeze state
		const balls = [
			{ x: 100, y: 150, vx: 2.5, vy: 2, size: 12, squeezeX: 1, squeezeY: 1 },
			{ x: 300, y: 400, vx: -2, vy: 2.5, size: 14, squeezeX: 1, squeezeY: 1 },
			{ x: 500, y: 200, vx: 1.8, vy: -2.2, size: 10, squeezeX: 1, squeezeY: 1 },
			{ x: 200, y: 500, vx: -2.2, vy: -1.8, size: 12, squeezeX: 1, squeezeY: 1 }
		];

		// Track previous positions for the glow trail effect
		const trails: Array<Array<{ x: number; y: number }>> = balls.map(() => []);

		let frameId = 0;

		const animate = () => {
			const w = window.innerWidth;
			const h = window.innerHeight;

			balls.forEach((ball, i) => {
				// Recover squeeze towards 1
				ball.squeezeX += (1 - ball.squeezeX) * 0.15;
				ball.squeezeY += (1 - ball.squeezeY) * 0.15;

				// Update position
				ball.x += ball.vx;
				ball.y += ball.vy;

				// Bounce off walls with squeeze effect
				if (ball.x <= 0 || ball.x >= w - ball.size) {
					ball.vx = -ball.vx;
					ball.x = Math.max(0, Math.min(ball.x, w - ball.size));
					ball.squeezeX = 0.6; // Horizontal squeeze
					ball.squeezeY = 1.3; // Vertical stretch
				}
				if (ball.y <= 0 || ball.y >= h - ball.size) {
					ball.vy = -ball.vy;
					ball.y = Math.max(0, Math.min(ball.y, h - ball.size));
					ball.squeezeX = 1.3; // Horizontal stretch
					ball.squeezeY = 0.6; // Vertical squeeze
				}

				// Store current position for trail
				trails[i].push({ x: ball.x, y: ball.y });

				// Longer trail (20 positions)
				if (trails[i].length > 20) trails[i].shift();

				// Update DOM
				const el = ballRefs[i].current;
				if (el) {
					el.style.transform = `translate(${ball.x}px, ${ball.y}px) scale(${ball.squeezeX}, ${ball.squeezeY})`;

					// Create sharp trailing glow effect (comet tail)
					// Inside your animate function:
					const trailShadows = trails[i]
						.map((pos, idx) => {
							const age = trails[i].length - idx;
							const opacity = 0.08 + (age / trails[i].length) * 0.25;
							const blur = 10 + age * 0.2; // Increased blur for smoother trail
							const dx = ball.x - pos.x;
							const dy = ball.y - pos.y;
							const spread = 0.5 + age * 0.1;
							return `${-dx}px ${-dy}px ${blur}px ${spread}px rgba(0, 255, 255, ${opacity})`;
						})
						.join(', ');

					el.style.boxShadow = `0 0 8px 2px rgba(0, 255, 255, 0.5), ${trailShadows}`;

				}
			});

			frameId = requestAnimationFrame(animate);
		};

		frameId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frameId);
	}, []);

	return (
		<div ref={containerRef} className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
			{ballConfigs.map((config, index) => (
				<div
					key={index}
					ref={ballRefs[index]}
					style={{
						position: 'absolute',
						width: config.size + 'px',
						height: config.size + 'px',
						backgroundColor: 'rgba(255, 255, 255, 0.8)',
						borderRadius: '50%',
						pointerEvents: 'none'
					}}
				/>
			))}
		</div>
	);
}

// Connect4 Ghost Component - signalling variety (Right Biased & Dropping)
function Connect4Ghost() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const screenHeight = window.innerHeight;
		const startY = -screenHeight * 0.5;
		const endY = screenHeight * 1.5;

		// Use transform directly for reliable animation
		const controls = animate(
			container,
			{ transform: [`translateY(${startY}px)`, `translateY(${endY}px)`] },
			{ duration: 60, repeat: Infinity, ease: 'linear' }
		);

		return () => controls.stop();
	});

	return (
		<div
			ref={containerRef}
			style={{
				position: 'fixed',
				top: 0,
				right: '5%',
				zIndex: 4,
				display: 'flex',
				flexDirection: 'column',
				gap: '60px',
				opacity: 0.2,
				filter: 'blur(35px) saturate(0.7)',
				pointerEvents: 'none',
				willChange: 'transform'
			}}
		>
			<div className="w-[500px] h-[500px] rounded-full" style={{ background: '#facc15' }} />
			<div className="w-[450px] h-[450px] rounded-full" style={{ background: '#ef4444' }} />
			<div className="w-[550px] h-[550px] rounded-full" style={{ background: '#facc15' }} />
		</div>
	);
}

// Center Core - Mandatory anchor
function CenterCore() {
	return (
		<div
			className="fixed inset-0 pointer-events-none z-[1]"
			style={{
				background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.12) 0%, transparent 60%)',
				pointerEvents: 'none'
			}}
		/>
	);
}

export default function App() {
	return (
		<div className="min-h-screen w-full relative overflow-hidden isolation-isolate">
			{/* Ball Chaos Arena background */}
			<BallChaosArena />

			{/* Connect 4 Drop Motion */}
			<Connect4Ghost />

			{/* Center Core Anchor */}
			<CenterCore />

			{/* Base Foundation: Deep Radial Gradient & Vertical Vignette */}
			<div
				className="absolute inset-0 -z-10"
				style={{
					background: `radial-gradient(circle at center, var(--color-start) 40%, #000 100%)`
				}}
			>
				{/* Vertical Vignette - suggested by user for structure */}
				<div
					className="absolute inset-0"
					style={{
						background: `linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)`
					}}
				/>
			</div>

			{/* Main content - Minimalist Focus */}
			<div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 relative z-20">

				<div className="flex flex-col items-center gap-12 max-w-2xl w-full text-center">

					{/* Primary & Secondary Actions Only */}
					<div className="flex flex-col gap-6 items-center w-full">
						{/* Primary: Quick Play - LARGE, DOMINANT */}
						<Button
							variant="hero"
							size="xl"
							href="/game/pre_match_scene"
							className="w-full sm:w-80 h-20 text-2xl"
						>
							Choose Mode
						</Button>
						<Button
							variant="secondary"
							size="lg"
							onClick={() => navigate("/game/pong", {
								state: {
									mode: "ai",
									p1: "Player 1",
									difficulty: "medium"
								}
							})}
							className="w-full sm:w-64"
						>
							Quick Play
						</Button>
					</div>

				</div>

				{/* Minimalist Footer */}
				<footer
					className="absolute bottom-8 w-full px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] tracking-[0.2em] uppercase"
					style={{ color: 'var(--color-primary)', opacity: 0.3 }}
				>
					<a href="/terms_of_service" className="hover:opacity-100 transition-opacity">Terms of Service</a>
					<span className="hidden sm:inline opacity-30">|</span>
					<a href="/privacy_policy" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
					<span className="hidden sm:inline opacity-30">|</span>
					<span>© 2026 FT_TRANSCENDENCE</span>
				</footer>
			</div>
		</div>
	);
}
