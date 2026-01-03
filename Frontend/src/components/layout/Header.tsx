
import {useState} from "Reactor"
export default function Header() {
	const [a,b] = useState(0);
	const [c,d] = useState(0);
	return (
	  <header className="h-height-offset px-6 flex items-center justify-between shadow-lg backdrop-blur">
		<div className="flex items-center gap-4">
		  <div className="logo-mark" />
		  <div className="flex flex-col leading-tight">
			<span className="logo-subtitle">Transcendence</span>
			<span className="text-xl font-semibold text-primary">Control Center</span>
		  </div>
		</div>
		<div onClick={() => b(prev => {
			const next = prev + 1;
			console.log(next);
			return next;
		})}>{a}</div>
		<div onClick={() => d(prev => {
			const next = prev + 1;
			console.log(next);
			return next;
		})}>{c}</div>
		<div className="flex items-center gap-4">
		  <button className="primary-btn color-primary">
			Settings
		  </button>
		  <div className="avatar-shell" />
		</div>
	  </header>
	);
  }
  
