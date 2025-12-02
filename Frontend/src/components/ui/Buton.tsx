import {useState}from "Reactor"

export default function button(){
	const [count, setCount] = useState(0);

	return(
		<div>
			<button className="w-[24px] h-[24px] bg-amber-300 p-[1] text-black" onClick={() => {setCount(count + 1);}}>{count}</button>
			</div>
	);

}