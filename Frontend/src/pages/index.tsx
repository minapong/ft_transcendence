// import { useState, useEffect } from "@/reactor";
import { animate } from "motion";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div id="box" className="w-32 h-32 bg-blue-500 rounded-xl cursor-pointer flex items-center justify-center text-white text-xl"
        onClick={() => {animate("#box", { x: 150, rotate: 45, scale: 1.2 }, { duration: 0.5 });}}>
        Tap
      </div>
    </div>
  );
}
