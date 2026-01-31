import { navigate, useEffect, useRef } from 'Reactor';
import { apiFetch } from "@/core/lib/api";
import { useScreen } from "@/app/hooks/useScreen";
import Button from "@/app/components/ui/Button";

// Crispy Pong Animation Component
function PongAnimation() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const screen = useScreen();

	useEffect(() => {
		const canvas = canvasRef.current;
		const frameId = { current: 0 };

		if (!canvas) return;

		const ctx = canvas.getContext('2d', { alpha: true }); // aplha true sets the window transparent
		if (!ctx) return;

		// --- PRE-RENDERING (Glows) ---
		// User requested specialized Gradient Caching using translate
		const ballRadius = 8;
		const glowRadius = ballRadius * 3;

		// Create gradient once, centered at 0,0
		const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
		glowGradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
		glowGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

		// --- OBJECT POOLING (Trail Ring Buffer) ---
		const TRACE_LEN = 15;
		const trailPool = new Array(TRACE_LEN).fill(0).map(() => ({ x: 0, y: 0, active: false }));
		let trailHead = 0; // Points to the current writing index

		// Game State
		const ball = {
			x: 0, y: 0,
			speedX: 4, speedY: 3,
			radius: 8, maxSpeed: 8
		};

		const paddleWidth = 12;
		const paddleHeight = 120;
		const paddleOffset = 60;

		// AI State: add targetY
		const leftPaddle = { x: 0, y: 0, width: paddleWidth, height: paddleHeight, speed: 3.5, targetY: 0 };
		const rightPaddle = { x: 0, y: 0, width: paddleWidth, height: paddleHeight, speed: 3.5, targetY: 0 };

		// Assets
		const BALL_COLOR = '#ffffff';
		const PADDLE_COLOR = '#00ffff';
		const TRAIL_COLOR = '#00ffff';
		const CENTER_LINE_COLOR = 'rgba(0, 255, 255, 0.4)';

		// Logical dimensions for game logic (independent of physical pixels)
		let logicalWidth = 0;
		let logicalHeight = 0;

		// --- AI PREDICTION ---
		// Cheap O(1) reflection math
		const predictBallY = (b: typeof ball, targetX: number, height: number) => {
			const dx = targetX - b.x;
			// Safe guard div by zero (shouldn't happen with moving ball)
			if (Math.abs(b.speedX) < 0.1) return b.y;

			const time = dx / b.speedX;
			if (time < 0) return height / 2; // Ball moving away, return center

			// Projected Y without walls
			let finalY = b.y + b.speedY * time;

			// Reflect against walls (0 and height)
			// Effective bounce area is from radius to height-radius
			const min = b.radius;
			const max = height - b.radius;
			const range = max - min;

			// Normalized to 0-range
			const relativeY = finalY - min;

			// Number of bounces
			const bounces = Math.floor(relativeY / range);

			// Even bounces: relativeY % range
			// Odd bounces: range - (relativeY % range)
			// effectively: abs(relativeY % (2*range) - range) if we shift origin logic
			// Simple iterative modulo logic:
			let remainder = relativeY % (2 * range);
			if (remainder < 0) remainder += 2 * range; // Handle negative math

			// Triangle wave
			if (remainder > range) {
				return max - (remainder - range);
			} else {
				return min + remainder;
			}
		};

		const recalculateTargets = () => {
			// Add noise for imperfection (+/- 10px error range)
			// User suggested 6, but 10 feels a bit more natural for "imperfect" without being bad.
			// Let's stick to user's suggestion scale but maybe slightly tuned.
			const noise = (Math.random() - 0.5) * 20;

			// If ball moving Left, predict Left Paddle. Right Paddle goes to center or stays?
			// Let's make Right Paddle return to center when idle for "human" feel, or just stay put.
			// User said "Move paddle toward that (intercept)". Implied idle behavior is up to us.
			// Let's make idle = center for better gameplay readiness.

			if (ball.speedX < 0) {
				leftPaddle.targetY = predictBallY(ball, leftPaddle.x + leftPaddle.width + ball.radius, logicalHeight) + noise; // Hit right side of left paddle
				rightPaddle.targetY = logicalHeight / 2 - rightPaddle.height / 2;
			} else {
				rightPaddle.targetY = predictBallY(ball, rightPaddle.x - ball.radius, logicalHeight) + noise; // Hit left side of right paddle
				leftPaddle.targetY = logicalHeight / 2 - leftPaddle.height / 2;
			}
		};

		const handleResize = () => {
			const dpr = window.devicePixelRatio || 1;
			logicalWidth = window.innerWidth;
			logicalHeight = window.innerHeight;

			// Set physical dimensions via scaling
			canvas.width = logicalWidth * dpr;
			canvas.height = logicalHeight * dpr;

			// CSS dimensions ensure it fits the window
			canvas.style.width = logicalWidth + 'px';
			canvas.style.height = logicalHeight + 'px';

			// Scale drawing context so we can use logical coordinates
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			leftPaddle.x = paddleOffset;
			rightPaddle.x = logicalWidth - paddleOffset - paddleWidth;

			// Init/Reset positions on first resize or if needed
			if (ball.x === 0 && ball.y === 0) {
				ball.x = logicalWidth / 2;
				ball.y = logicalHeight / 2;
				leftPaddle.y = logicalHeight / 2 - paddleHeight / 2;
				rightPaddle.y = logicalHeight / 2 - paddleHeight / 2;
				// Initial prediction
				recalculateTargets();
			}
		};

		handleResize();

		// Smooth LERP behavior to reduce jitter and look more organic
		const updateAI = (p: typeof leftPaddle) => {
			// Target center
			let target = p.targetY;

			// We predicted Ball Center Y. Paddle needs to align its center to that.
			// So Paddle Y = Ball Y - Paddle Height / 2
			// But check if our predict function returned ball center or paddle top?
			// It returned ball Y.
			target = target - p.height / 2;

			// Clamp target to bounds
			const maxPos = logicalHeight - p.height;
			if (target < 0) target = 0;
			if (target > maxPos) target = maxPos;

			// Lerp factor (0.08 at 120Hz is responsive but smooth)
			const lerp = 0.08;
			p.y += (target - p.y) * lerp;

			// Snap if very close to avoid constant micro-calcs (optional, but saves dirty bits)
			if (Math.abs(target - p.y) < 0.5) p.y = target;

			// Hard Clamp
			if (p.y < 0) p.y = 0;
			else if (p.y > maxPos) p.y = maxPos;
		};

		// --- FIXED TIMESTEP LOGIC ---
		const updatePhysics = () => {
			// Logic
			ball.x += ball.speedX;
			ball.y += ball.speedY;

			if (ball.y < ball.radius) {
				ball.y = ball.radius;
				ball.speedY = -ball.speedY;
			} else if (ball.y > logicalHeight - ball.radius) {
				ball.y = logicalHeight - ball.radius;
				ball.speedY = -ball.speedY;
			}

			// Collision
			let hit = false;
			let isLeft = false;

			// Optimization: Only check near paddles
			if (ball.speedX < 0 && ball.x < leftPaddle.x + leftPaddle.width + ball.radius) {
				if (ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
					hit = true; isLeft = true;
				}
			} else if (ball.speedX > 0 && ball.x > rightPaddle.x - ball.radius) {
				if (ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
					hit = true; isLeft = false;
				}
			}

			if (hit) {
				ball.speedX = -ball.speedX;
				const p = isLeft ? leftPaddle : rightPaddle;
				const hitPos = (ball.y - p.y) / p.height - 0.5;
				ball.speedY += hitPos * 2;

				ball.speedX *= 1.05; ball.speedY *= 1.05;

				const sqSpeed = ball.speedX * ball.speedX + ball.speedY * ball.speedY;
				if (sqSpeed > ball.maxSpeed * ball.maxSpeed) {
					const scale = ball.maxSpeed / Math.sqrt(sqSpeed);
					ball.speedX *= scale; ball.speedY *= scale;
				}

				if (isLeft) ball.x = p.x + p.width + ball.radius;
				else ball.x = p.x - ball.radius;

				// RECALCULATE TARGETS ON HIT
				recalculateTargets();
			}

			if (ball.x < -50 || ball.x > logicalWidth + 50) {
				ball.x = logicalWidth / 2; ball.y = logicalHeight / 2;
				ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 4;
				ball.speedY = (Math.random() - 0.5) * 4;
				for (let k = 0; k < TRACE_LEN; k++) trailPool[k].active = false;

				// RECALCULATE TARGETS ON RESET
				recalculateTargets();
			}

			updateAI(leftPaddle);
			updateAI(rightPaddle);

			// Update Trail (Ring Buffer)
			const tNode = trailPool[trailHead];
			tNode.x = ball.x;
			tNode.y = ball.y;
			tNode.active = true;
			trailHead = (trailHead + 1) % TRACE_LEN;
		};

		const draw = () => {
			ctx.clearRect(0, 0, logicalWidth, logicalHeight);

			// DRAWING

			// Trail
			ctx.fillStyle = TRAIL_COLOR;
			for (let i = 1; i <= TRACE_LEN; i++) {
				const idx = (trailHead - i + TRACE_LEN) % TRACE_LEN;
				const node = trailPool[idx];
				if (!node.active) break;

				const opacity = 1.0 - (i / TRACE_LEN);
				if (opacity <= 0) continue;

				ctx.globalAlpha = opacity * 0.6;
				ctx.beginPath();
				const r = ball.radius * opacity;
				ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1.0;

			// Ball & Glow
			// User Pattern: Create gradient once (0,0), translate to position to draw
			ctx.save();
			ctx.translate(ball.x, ball.y);
			ctx.fillStyle = glowGradient;
			ctx.beginPath();
			ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
			ctx.fill();

			// Draw Core (at 0,0 relative to translation)
			ctx.fillStyle = BALL_COLOR;
			ctx.beginPath();
			ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();

			// Paddles
			ctx.fillStyle = PADDLE_COLOR;
			ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
			ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

			// Center Line
			ctx.strokeStyle = CENTER_LINE_COLOR;
			ctx.lineWidth = 3;
			ctx.setLineDash([10, 15]);
			ctx.beginPath();
			ctx.moveTo(logicalWidth / 2, 0);
			ctx.lineTo(logicalWidth / 2, logicalHeight);
			ctx.stroke();
			ctx.setLineDash([]);
		};

		let lastTime = performance.now();
		let accumulator = 0;
		const step = 1000 / 120; // 120 FPS Physics

		const animate = (now: number) => {
			accumulator += now - lastTime;
			lastTime = now;

			// Limit accumulator to avoid "spiral of death" if frame rate drops deeply
			if (accumulator > 100) accumulator = 100;

			while (accumulator >= step) {
				updatePhysics();
				accumulator -= step;
			}

			draw();
			frameId.current = requestAnimationFrame(animate);
		};

		frameId.current = requestAnimationFrame(animate);
		// console.log("index page useeffect")
		return () => {
			if (frameId.current) cancelAnimationFrame(frameId.current);
		};
	});

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: 5,
				opacity: 0.4,
				pointerEvents: 'none'
			}}
		/>
	);
}

// Connect4 Ghost Component - signalling variety (Right Biased & Dropping)
function Connect4Ghost() {
	return (
		<div
			style={{
				position: 'fixed',
				top: '-50%', // Start from top
				right: '5%', // Right bias
				zIndex: 4,
				display: 'flex',
				flexDirection: 'column',
				gap: '60px',
				opacity: 0.2,
				filter: 'blur(35px) saturate(0.7)',
				pointerEvents: 'none',
				animation: 'connect4Drop 80s linear infinite'
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
			{/* Crispy Pong Animation */}
			<PongAnimation />

			{/* Connect 4 Drop Motion */}
			<Connect4Ghost />

			{/* Center Core Anchor */}
			<CenterCore />

			{/* Animated gradient background - alive, not loud */}
			<div
				className="absolute inset-0 -z-10"
				style={{
					background: `linear-gradient(180deg, 
						var(--color-start) 0%, 
						var(--color-mid) 50%, 
						var(--color-end) 100%)`,
					animation: 'gradientShift 20s ease-in-out infinite'
				}}
			>
				{/* Faint grid drift - barely visible, echoes Pong court + Connect4 grid */}
				<svg
					className="absolute inset-0 w-full h-full opacity-[0.03]"
					style={{ animation: 'gridDrift 45s linear infinite' }}
				>
					<defs>
						<pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
							<path
								d="M 80 0 L 0 0 0 80"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
								style={{ color: 'var(--color-accent)' }}
							/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#grid)" />
				</svg>

				{/* Subtle animated noise overlay */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
						animation: 'noiseDrift 30s linear infinite'
					}}
				/>
			</div>

			{/* Main content - vertically centered but biased */}
			<div className="flex items-center justify-center min-h-screen px-6 py-12 relative z-20">
				<div className="flex flex-col items-center gap-12 max-w-5xl w-full">

					{/* Intent Split: 3 Cards - Shifted UPWARD */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full -mt-16 mb-4">

						{/* PLAY Card */}
						<button
							className="group fx-energy energy-none hover:energy-low relative p-8 rounded-2xl text-left
								transition-all duration-300 ease-out
								hover:scale-105 active:scale-98
								focus-visible:outline-2 focus-visible:outline-offset-4"
							style={{
								background: 'rgba(255, 255, 255, 0.03)',
								backdropFilter: 'blur(12px)',
								boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.4)',
								outlineColor: 'var(--color-accent)'
							}}
						>
							<div className="relative z-10">
								<h2
									className="text-3xl font-bold mb-4 tracking-tight"
									style={{ color: 'var(--color-accent)' }}
								>
									PLAY
								</h2>
								<ul className="space-y-2 text-sm opacity-80" style={{ color: 'var(--color-primary)' }}>
									<li>→ Quick Match</li>
									<li>→ Casual</li>
									<li>→ Ranked</li>
								</ul>
							</div>

							{/* Energy Layer handles the glow via pseudoelements */}
						</button>

						{/* TOURNAMENTS Card */}
						<button
							className="group fx-energy energy-none hover:energy-low relative p-8 rounded-2xl text-left
								transition-all duration-300 ease-out
								hover:scale-105 active:scale-98
								focus-visible:outline-2 focus-visible:outline-offset-4"
							style={{
								background: 'rgba(255, 255, 255, 0.03)',
								backdropFilter: 'blur(12px)',
								boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.4)',
								outlineColor: 'var(--color-accent)'
							}}
						>
							<div className="relative z-10">
								<h2
									className="text-3xl font-bold mb-4 tracking-tight"
									style={{ color: 'var(--color-accent)' }}
								>
									TOURNAMENTS
								</h2>
								<ul className="space-y-2 text-sm opacity-80" style={{ color: 'var(--color-primary)' }}>
									<li>→ Join Live</li>
									<li>→ Create</li>
									<li>→ Upcoming</li>
								</ul>
							</div>

							{/* Energy Layer handles the glow via pseudoelements */}
						</button>

						{/* WATCH Card */}
						<button
							className="group fx-energy energy-none hover:energy-low relative p-8 rounded-2xl text-left
								transition-all duration-300 ease-out
								hover:scale-105 active:scale-98
								focus-visible:outline-2 focus-visible:outline-offset-4"
							style={{
								background: 'rgba(255, 255, 255, 0.03)',
								backdropFilter: 'blur(12px)',
								boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.4)',
								outlineColor: 'var(--color-accent)'
							}}
						>
							<div className="relative z-10">
								<h2
									className="text-3xl font-bold mb-4 tracking-tight"
									style={{ color: 'var(--color-accent)' }}
								>
									WATCH
								</h2>
								<ul className="space-y-2 text-sm opacity-80" style={{ color: 'var(--color-primary)' }}>
									<li>→ Spectate Live</li>
									<li>→ Replays</li>
								</ul>
							</div>

							{/* Energy Layer handles the glow via pseudoelements */}
						</button>
					</div>

					{/* Smart CTAs - Shifted DOWNWARD */}
					<div className="flex flex-col sm:flex-row gap-6 items-center mt-8">
						{/* Primary: Quick Play */}
						<Button
							variant="hero"
							size="xl"
							href="/game/pre_match_scene"
						>
							Quick Play
						</Button>

						{/* Secondary: Choose Mode */}
						<Button
							variant="secondary"
							size="lg"
						>
							Choose Mode
						</Button>
					</div>

					{/* Live signal - ONE line, creates urgency */}
					<p
						className="text-xs tracking-wider uppercase flex items-center gap-2"
						style={{ color: 'var(--color-primary)', opacity: 0.6 }}
					>
						<span
							className="w-2 h-2 rounded-full animate-pulse"
							style={{ background: '#22c55e' }}
						/>
						1,247 players online · 32 matches live
					</p>
				</div>
			</div>

			{/* CSS animations */}
			<style>{`
				@keyframes gradientShift {
					0%, 100% { filter: hue-rotate(0deg) brightness(1); }
					50% { filter: hue-rotate(5deg) brightness(0.95); }
				}

				@keyframes connect4Drop {
					0% { transform: translateY(0); }
					100% { transform: translateY(150%); }
				}
				
				@keyframes gridDrift {
					0% { transform: translate(0, 0); }
					100% { transform: translate(80px, 80px); }
				}
				
				@keyframes noiseDrift {
					0% { transform: translate(0, 0); }
					100% { transform: translate(10%, 10%); }
				}
			`}</style>
		</div>
	);
}
