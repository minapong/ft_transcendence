
export default function NotFound() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center z-10 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            {/* 404 Text */}
            <div className="relative">
                <h1 className="text-[12rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-accent to-accent-soft/20 select-none drop-shadow-2xl">
                    404
                </h1>
                <div className="absolute inset-0 bg-gradient-to-b from-accent to-transparent opacity-10 blur-xl animate-pulse pointer-events-none" />
            </div>

            {/* Message */}
            <div className="space-y-4 max-w-lg mx-auto relative z-10 mt-[-2rem]">
                <h2 className="text-4xl font-bold text-slate-100 tracking-tight">
                    System Malfunction
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                    The requested coordinate lies beyond the known boundaries of this transcendence.
                    <br className="hidden sm:block" /> Return to the grid before signal is lost.
                </p>
            </div>

            {/* CTA Button */}
            <a
                href="/"
                className="mt-12 group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-surface border border-white/10 overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_30px_-5px_var(--color-accent)]"
            >
                <span className="absolute inset-0 bg-accent/10 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />

                <span className="relative flex items-center gap-2 font-semibold text-accent tracking-wide group-hover:text-white transition-colors">
                    <span className="icon-[solar--home-angle-bold-duotone] text-xl" />
                    <span>Return Home</span>
                </span>
            </a>

            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />
        </div>
    );
}
