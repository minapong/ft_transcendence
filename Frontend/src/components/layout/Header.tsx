export default function Header() {
	return (
	  <header className="h-height-offset px-6 flex items-center justify-between shadow-lg backdrop-blur">
		<div className="flex items-center gap-4">
		  <div className="logo-mark" />
		  <div className="flex flex-col leading-tight">
			<span className="logo-subtitle">Transcendence</span>
			<span className="text-xl font-semibold text-primary">Control Center</span>
		  </div>
		</div>
		<div className="flex items-center gap-4">
		  <button className="primary-btn color-primary">
			Settings
		  </button>
		  <div className="avatar-shell" />
		</div>
	  </header>
	);
  }
  