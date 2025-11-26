// import { useEffect, useRef } from "@/Reactor";
// import * as BABYLON from "babylonjs";

// export default function Scene() {
//   const canvasRef = useRef(null);
//   console.log("bugging")
//   useEffect(() => {
//     console.log("EFFECT CALLBACK QUEUED");
//     queueMicrotask(() => {
//     const canvas = canvasRef.current;
//   	console.log("canvasRef", canvasRef.current);

//     const engine = new BABYLON.Engine(canvas, true);

//     const createScene = () => {
//       const scene = new BABYLON.Scene(engine);

//       const camera = new BABYLON.ArcRotateCamera(
//         "camera",
//         Math.PI / 2,
//         Math.PI / 3,
//         5,
//         BABYLON.Vector3.Zero(),
//         scene
//       );
//       camera.attachControl(canvas, true);

//       const light = new BABYLON.HemisphericLight(
//         "light",
//         new BABYLON.Vector3(0, 1, 0),
//         scene
//       );

//       BABYLON.MeshBuilder.CreateBox("box", {}, scene);

//       return scene;

//     };

//     const scene = createScene();

//     engine.runRenderLoop(() => scene.render());
//     window.addEventListener("resize", engine.resize);
//     return () => {
//       engine.dispose();
//     };
  
//   })});

//   return (
//     <div>
//       <h1>hashir</h1>
//       <canvas
//       ref={canvasRef}
//       className="h-body-screenHeight w-width-screen"
//       ></canvas>
//       </div>
//   );
// }


import { useEffect, useRef } from "@/Reactor";
import * as BABYLON from "babylonjs";

export default function Scene() {
  const canvasRef = useRef(null);
  console.log("bugging")
  useEffect(() => {
    console.log("EFFECT EXECUTED");
  });

  return (
    <div>
      <h1>hashir</h1>
      <canvas
      ref={canvasRef}
      className="h-body-screenHeight w-width-screen"
      ></canvas>
      </div>
  );
}
