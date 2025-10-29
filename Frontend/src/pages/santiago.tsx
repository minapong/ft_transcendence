export default function login(){
	return(
		<div className="w-screen h-screen flex justify-center items-center text-3xl bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500 rounded-lg blur-3xl opacity-30 animate-pulse"></div>
            <div onClick={()=>alert("as")} id="as" className="relative bg-cyan-500 text-white border-4 border-cyan-300 text-5xl font-bold px-8 py-6 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-2xl">Saniago</div>
			<button className="w-screen z-10"  onClick={()=>alert("as")}>hashiur</button>
		</div>
	);
}