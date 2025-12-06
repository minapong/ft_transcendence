import { animate } from "motion";
import {useEffect, useState, useRef} from "Reactor"
import Button from "@/components/ui/Buton"

export default function Home() {
  const [aRehman,setaRehman] = useState(0);
  const [boxTransform, setBoxTransform] = useState("");
  const boxRef = useRef(null);
  const [effectTriggered, setEffectTriggered] = useState(false); // <-- new state

  useEffect(() => {
    console.log("EFFECT EXECUTED in index");

    // Try reading state
    console.log("Current aRehman:", aRehman);

    // Try setting state
    setEffectTriggered(true);  // <-- see if this triggers re-renders

  }, []); // still empty deps

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
            setBoxTransform(getComputedStyle(box).transform || "");
          });
        }}>
        Tap
      </div>

      <Button></Button>

      <div className="w-[40px] h-[40px] bg-aqua-400 text-3xl text-white" 
           onClick={()=>{setaRehman(prev => prev+1);console.log("aRehman clicked")}}>
        {aRehman}
      </div>

      <div>Effect triggered state: {effectTriggered ? "YES" : "NO"}</div>
    </div>
  );
}