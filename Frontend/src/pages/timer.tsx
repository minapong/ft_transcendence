import { useEffect,useState, useRef } from "Reactor";

export default function TimerPage() {
	const [count, setCount] = useState(0);
	useEffect(() => {
		console.log("Effect ran because TimerPage changed:", count);
		// return () => console.log("Cleanup for TimerPage:", count);
	});

	return (
		<div>
			<h1>Count: {count}</h1>
			<button className="w-[24px] h-[24px] bg-amber-300 p-[1] text-black" onClick={() => {setCount(count + 1);}}>+</button>
		</div>
	);}