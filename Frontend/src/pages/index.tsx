import { animate } from "motion";

import {useEffect,useState,useRef} from "Reactor"
import Button from "@/components/ui/Buton"
export default function Home() {
  const [aRehman,setaRehman] = useState(0);
  const [boxTransform, setBoxTransform] = useState("");
  const [dropdownValue, setDropdownValue] = useState("Option 1");
  const boxRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
      console.log("EFFECT EXECUTED in index");
	  setaRehman(prev=>prev+1);
    },[]);

  return (
    <div className="h-body-screenHeight w-width-screen flex justify-around items-center flex-col">
      <div id="box" className="w-32 h-32 bg-blue-500 rounded-xl cursor-pointer flex items-center justify-center text-white text-xl"
        ref={boxRef}
        style={{ transform: boxTransform }}
        onClick={() => {
          const box = boxRef.current;
          if (!box) return;
          const controls = animate(box, { x: 150, rotate: 45, scale: 1.2 }, { duration: 0.5 });
          controls.finished.then(() => {
            // persist the final transform so rerenders keep the visual state
            setBoxTransform(getComputedStyle(box).transform || "");
          });
        }}>
        Tap
      </div>
      <Button></Button>
     <div className="w-[40px] h-[40px] bg-aqua-400 text-3xl text-white">{aRehman}</div>
      <select
        value={dropdownValue}
        onChange={(e) => setDropdownValue(e.target.value)}
        className="px-9 py-2 border-2 bg-blue-500 rounded-lg mt-4  shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all"
      >
        <option value="Option 1" className="text-gray-700">Option 1</option>
        <option value="Option 2" className="text-gray-700">Option 2</option>
        <option value="Option 3" className="text-gray-700">Option 3</option>
      </select>
      <div className="mt-4 text-lg font-bold text-blue-600">
        You selected: <span className="text-gray-300">{dropdownValue}</span>
      </div>
    </div>
  );
}
