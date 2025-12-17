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


import { useState } from "Reactor";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Missing email or password");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // ✅ save auth info
      localStorage.setItem("auth", JSON.stringify(data));

      // ✅ go home
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Sign In</h1>

      <input
        className="px-4 py-2 rounded text-black"
        placeholder="Email"
        value={email}
        onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
      />

      <input
        type="password"
        className="px-4 py-2 rounded text-black"
        placeholder="Password"
        value={password}
        onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500"
      >
        Login
      </button>
    </div>
  );
}
