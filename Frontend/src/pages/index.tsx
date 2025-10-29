export default () => {
	return(
		<div className="w-screen h-screen flex justify-center items-center text-3xl bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900  relative overflow-hidden">
			<div className="absolute top-0 right-0 left-0 bottom-0 bg-cyan-500 rounded-lg blur-3xl opacity-40 animate-pulse"></div>
			<div onClick={() => alert("Test alert!")} className="relative bg-cyan-300 text-white border-8 border-cyan-500 text-5xl font-bold px-8 py-6 rounded-xl shadow-2xl hover:scale-110 transition-all duration-100 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-2xl">Home Sweet Home</div>
		</div>
	);
}