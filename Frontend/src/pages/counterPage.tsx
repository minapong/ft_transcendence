import { useState, useEffect, useRef, useMemo } from "Reactor";

let logCounter = 0;

export default function HookStressLab() {
	console.log(`${++logCounter} 🔁 Render triggered`);

	// --------------------------
	// 1) STATE TESTS
	// --------------------------
	const [count, setCount] = useState(0);
	const [mode, setMode] = useState("🔵 Idle");
	const [flip, setFlip] = useState(false);

	// --------------------------
	// 2) REF TEST
	// --------------------------
	const renderRef = useRef(0);
	renderRef.current++;

	const boxRef = useRef(null);

	// --------------------------
	// 3) MEMO TEST
	// --------------------------
	const expensive = useMemo(() => {
		console.log(`${++logCounter} ⚙️ Heavy memo recalculated`);
		let s = 0;
		for (let i = 0; i < 50000; i++) s += i * count;
		return s;
	}, [count]);

	// --------------------------
	// 4) EFFECT TESTS
	// --------------------------

	// a) runs EVERY render
	useEffect(() => {
		console.log(`${++logCounter} 🌍 effect: no deps (runs each render)`);
		return () => console.log(`${++logCounter} 🧹 cleanup: no deps`);
	});

	// b) runs ONCE
	useEffect(() => {
		console.log(`${++logCounter} 🚀 effect: [] (mount only)`);
		return () => console.log(`${++logCounter} 🧹 cleanup: [] (unmount)`);
	}, []);

	// c) runs when `mode` changes
	useEffect(() => {
		console.log(`${++logCounter} 🎛 effect: [mode] →`, mode);
		return () => console.log(`${++logCounter} 🧹 cleanup: [mode]`);
	}, [mode]);

	// d) runs when flip changes
	useEffect(() => {
		console.log(`${++logCounter} 🔄 effect: [flip] changed`);
		return () => console.log(`${++logCounter} 🧹 cleanup: [flip]`);
	}, [flip]);

	// --------------------------
	// UI
	// --------------------------
	return (
		<div className="p-6 flex flex-col gap-6">

			{/* HEADER */}
			<div className="text-4xl font-bold text-center">
					🧪 Hook Stress Lab <span className="text-amber-400">v2</span>
			</div>

			{/* RENDER COUNT */}
			<div className="text-center text-lg">
				<span className="px-3 py-1 rounded bg-purple-500/30">
					🔥 Renders: <b>{renderRef.current}</b>
				</span>
			</div>

			{/* COUNT TEST */}
			<div className="flex flex-col items-center gap-2">
				<h2 className="text-xl font-semibold">Counter Test</h2>

				<div className="text-3xl font-bold">{count}</div>

				<button
					className="px-3 py-1 bg-emerald-400 hover:bg-emerald-500 rounded-md text-black transition"
					onClick={() => setCount(count + 1)}
				>
					➕ Increase
				</button>

				<div className="text-sm opacity-70">useMemo result: {expensive}</div>
			</div>

			{/* MODE TEST */}
			<div className="flex flex-col items-center gap-2">
				<h2 className="text-xl font-semibold">Mode Test</h2>

				<div className="px-3 py-1 rounded bg-sky-500/30 text-xl">
					{mode}
				</div>

				<button
					className="px-3 py-1 bg-sky-400 hover:bg-sky-500 rounded-md text-black transition"
					onClick={() => setMode(mode === "🔵 Idle" ? "🟢 Active" : "🔵 Idle")}
				>
					🔁 Toggle Mode
				</button>
			</div>

			{/* FLIP TEST */}
			<div className="flex flex-col items-center gap-2">
				<h2 className="text-xl font-semibold">Flip Test</h2>

				<div className="text-4xl">
					{flip ? "🧊" : "🔥"}
				</div>

				<button
					className="px-3 py-1 bg-rose-400 hover:bg-rose-500 rounded-md text-black transition"
					onClick={() => setFlip(!flip)}
				>
					🔄 Flip
				</button>
			</div>

			{/* REF TEST */}
			<div className="flex flex-col items-center gap-2">
				<h2 className="text-xl font-semibold">Ref Test</h2>

				<div
					ref={boxRef}
					className={`w-24 h-24 flex items-center justify-center rounded-md text-black transition 
							 ${flip ? "bg-yellow-300" : "bg-yellow-500"} 
							 ${count % 2 === 0 ? "rotate-3" : "-rotate-3"}`}
				>
					Box
				</div>

				<div className="opacity-70 text-sm">
					boxRef.current points to DOM: {boxRef.current ? "✅" : "❌"}
				</div>
			</div>

		</div>
	);
}
