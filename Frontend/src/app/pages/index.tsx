import { useEffect, useRef } from 'Reactor';

// Crispy Pong Animation Component
function PongAnimation() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		// Game state
		const ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: 8,
			speedX: 4,
			speedY: 3,
			maxSpeed: 8
		};

		const paddleWidth = 12;
		const paddleHeight = 120;
		const paddleOffset = 60;

		const leftPaddle = {
			x: paddleOffset,
			y: canvas.height / 2 - paddleHeight / 2,
			width: paddleWidth,
			height: paddleHeight,
			speed: 3.5
		};

		const rightPaddle = {
			x: canvas.width - paddleOffset - paddleWidth,
			y: canvas.height / 2 - paddleHeight / 2,
			width: paddleWidth,
			height: paddleHeight,
			speed: 3.5
		};

		// Trail effect
		const trail: { x: number; y: number; opacity: number }[] = [];
		const maxTrailLength = 15;

		// AI for paddles
		const updatePaddleAI = (paddle: typeof leftPaddle, targetY: number) => {
			const paddleCenter = paddle.y + paddle.height / 2;
			const diff = targetY - paddleCenter;

			if (Math.abs(diff) > paddle.speed) {
				paddle.y += diff > 0 ? paddle.speed : -paddle.speed;
			}

			// Keep paddle in bounds
			paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y));
		};

		// Game loop
		const animate = () => {
			// Clear with fade effect for trails
			ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update ball position
			ball.x += ball.speedX;
			ball.y += ball.speedY;

			// Add to trail
			trail.push({ x: ball.x, y: ball.y, opacity: 1 });
			if (trail.length > maxTrailLength) {
				trail.shift();
			}

			// Ball collision with top/bottom
			if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
				ball.speedY = -ball.speedY;
				ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
			}

			// Ball collision with paddles
			const hitLeftPaddle =
				ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
				ball.x + ball.radius > leftPaddle.x &&
				ball.y > leftPaddle.y &&
				ball.y < leftPaddle.y + leftPaddle.height;

			const hitRightPaddle =
				ball.x + ball.radius > rightPaddle.x &&
				ball.x - ball.radius < rightPaddle.x + rightPaddle.width &&
				ball.y > rightPaddle.y &&
				ball.y < rightPaddle.y + rightPaddle.height;

			if (hitLeftPaddle || hitRightPaddle) {
				ball.speedX = -ball.speedX;

				// Add spin based on where ball hits paddle
				const paddle = hitLeftPaddle ? leftPaddle : rightPaddle;
				const hitPos = (ball.y - paddle.y) / paddle.height - 0.5;
				ball.speedY += hitPos * 2;

				// Increase speed slightly
				ball.speedX *= 1.05;
				ball.speedY *= 1.05;

				// Cap speed
				const speed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
				if (speed > ball.maxSpeed) {
					ball.speedX = (ball.speedX / speed) * ball.maxSpeed;
					ball.speedY = (ball.speedY / speed) * ball.maxSpeed;
				}

				// Reposition ball
				ball.x = hitLeftPaddle
					? leftPaddle.x + leftPaddle.width + ball.radius
					: rightPaddle.x - ball.radius;
			}

			// Reset if ball goes out
			if (ball.x < -50 || ball.x > canvas.width + 50) {
				ball.x = canvas.width / 2;
				ball.y = canvas.height / 2;
				ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 4;
				ball.speedY = (Math.random() - 0.5) * 4;
				trail.length = 0;
			}

			// Update AI
			updatePaddleAI(leftPaddle, ball.y);
			updatePaddleAI(rightPaddle, ball.y);

			// Update paddle positions on resize
			leftPaddle.x = paddleOffset;
			rightPaddle.x = canvas.width - paddleOffset - paddleWidth;

			// Draw trail
			trail.forEach((point, index) => {
				const opacity = (index / trail.length) * 0.3;
				const size = ball.radius * (index / trail.length);
				ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`;
				ctx.beginPath();
				ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
				ctx.fill();
			});

			// Draw ball with glow
			const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius * 2);
			gradient.addColorStop(0, 'rgba(139, 92, 246, 1)');
			gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)');
			gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(ball.x, ball.y, ball.radius * 2, 0, Math.PI * 2);
			ctx.fill();

			// Draw ball core
			ctx.fillStyle = '#a78bfa';
			ctx.beginPath();
			ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
			ctx.fill();

			// Draw paddles with glow
			const drawPaddle = (paddle: typeof leftPaddle) => {
				// Paddle glow
				ctx.shadowBlur = 20;
				ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
				ctx.fillStyle = '#8b5cf6';
				ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

				// Paddle highlight
				ctx.shadowBlur = 0;
				ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
				ctx.fillRect(paddle.x, paddle.y, paddle.width * 0.3, paddle.height);
			};

			drawPaddle(leftPaddle);
			drawPaddle(rightPaddle);

			// Draw center line
			ctx.setLineDash([10, 15]);
			ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(canvas.width / 2, 0);
			ctx.lineTo(canvas.width / 2, canvas.height);
			ctx.stroke();
			ctx.setLineDash([]);

			requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 -z-5 opacity-50"
			style={{ imageRendering: 'crisp-edges' }}
		/>
	);
}

export default function App() {
	return (
		<div className="min-h-screen w-full relative overflow-hidden">
			{/* Crispy Pong Animation */}
			<PongAnimation />

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

			{/* Main content - vertically centered */}
			<div className="flex items-center justify-center min-h-screen px-6 py-12">
				<div className="flex flex-col items-center gap-8 max-w-5xl w-full">

					{/* Intent Split: 3 Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">

						{/* PLAY Card */}
						<button
							className="group relative p-8 rounded-2xl text-left
								transition-all duration-300 ease-out
								hover:scale-105 active:scale-98
								focus-visible:outline-2 focus-visible:outline-offset-4"
							style={{
								background: 'var(--color-panel)',
								border: '1px solid var(--color-border-strong)',
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

							{/* Hover glow */}
							<div
								className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
									transition-opacity duration-300 -z-10"
								style={{
									background: 'var(--color-accent)',
									filter: 'blur(40px)'
								}}
							/>
						</button>

						{/* TOURNAMENTS Card */}
						<button
							className="group relative p-8 rounded-2xl text-left
								transition-all duration-300 ease-out
								hover:scale-105 active:scale-98
								focus-visible:outline-2 focus-visible:outline-offset-4"
							style={{
								background: 'var(--color-panel)',
								border: '1px solid var(--color-border-strong)',
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

							<div
								className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
									transition-opacity duration-300 -z-10"
								style={{
									background: 'var(--color-accent)',
									filter: 'blur(40px)'
								}}
							/>
						</button>

						{/* WATCH Card */}
						<button
							className="group relative p-8 rounded-2xl text-left
								transition-all duration-300 ease-out
								hover:scale-105 active:scale-98
								focus-visible:outline-2 focus-visible:outline-offset-4"
							style={{
								background: 'var(--color-panel)',
								border: '1px solid var(--color-border-strong)',
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

							<div
								className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
									transition-opacity duration-300 -z-10"
								style={{
									background: 'var(--color-accent)',
									filter: 'blur(40px)'
								}}
							/>
						</button>
					</div>

					{/* Smart CTAs - replacing dumb "PLAY NOW" */}
					<div className="flex flex-col sm:flex-row gap-4 items-center">
						{/* Primary: Quick Play */}
						<button
							className="group relative px-12 py-4 rounded-xl text-xl font-bold tracking-wide
								transition-all duration-300 ease-out
								hover:scale-105 active:scale-98
								focus-visible:outline-2 focus-visible:outline-offset-4"
							style={{
								background: 'var(--color-accent)',
								color: '#000000',
								boxShadow: `
									0 20px 40px rgba(0, 0, 0, 0.35),
									0 0 28px color-mix(in srgb, var(--color-accent) 35%, transparent),
									inset 0 1px 0 rgba(255, 255, 255, 0.3)
								`,
								outlineColor: 'var(--color-accent)'
							}}
						>
							Quick Play
						</button>

						{/* Secondary: Choose Mode */}
						<button
							className="px-8 py-3 rounded-xl text-base font-medium
								transition-all duration-200
								hover:scale-105 active:scale-95"
							style={{
								background: 'var(--color-surface)',
								color: 'var(--color-primary)',
								border: '1px solid var(--color-border-soft)'
							}}
						>
							Choose Mode
						</button>
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