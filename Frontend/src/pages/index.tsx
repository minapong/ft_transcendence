// import { useState, useEffect } from "@/reactor";
import { animate } from "motion";

import {useEffect,useState} from "Reactor"

export default function Home() {
  const [aRehman,setaRehman] = useState(0);
    useEffect(() => {
      console.log("EFFECT EXECUTED in index");
    });

  return (
    <div className="h-body-screenHeight w-width-screen flex justify-around items-center flex-col">
      <div id="box" className="w-32 h-32 bg-blue-500 rounded-xl cursor-pointer flex items-center justify-center text-white text-xl"
        onClick={() => {animate("#box", { x: 150, rotate: 45, scale: 1.2 }, { duration: 0.5 });}}>
        Tap
      </div>
     <div className="w-[40px] h-[40px] bg-aqua-400 text-3xl text-white" onClick={()=>{setaRehman(aRehman+1);console.log("aRehman clicked")}}>{aRehman}</div>
    </div>
  );
}  
