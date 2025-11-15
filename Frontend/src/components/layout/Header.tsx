const links = [
	{label:"Home", href:"/"},
	{label:"Login", href:"/login"},
	{label:"Tournament",href:"/tournament/start"},
	{label:"Pong",href:"/pong"},
	{label:"Contact",href:"/contact"},
]

const linkStyle =
	"active:scale-90 bg-linear-to-br hover:from-cyan-100 hover:text-cyan-900 hover:to-cyan-400 from-cyan-900 to-cyan-600 text-white border-4 border-cyan-200 text-2xl font-bold px-2 py-1 rounded-xl shadow-2xl hover:scale-110 transition-all duration-150 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-2xl";

export function Header() {
	return (
		<div className="bg-linear-to-r from-blue-950 via-blue-900 to-cyan-900 text-white h-[7vh] flex items-center shadow-lg shadow-cyan-500/50 border-b-2 border-cyan-500/60 backdrop-blur-md">
			<nav className="flex justify-around items-center w-full px-8 gap-4">
			{links.map((link)=>(
				<a href={link.href} className={linkStyle}>{link.label}</a>
			))}
			</nav>
			
		</div>
	);
}

