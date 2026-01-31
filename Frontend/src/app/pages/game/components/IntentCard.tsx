import { Intent } from "@/core/engine/match_intent";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import SelectInput from "@/app/components/ui/SelectInput";

interface IntentCardProps {
    intent: Intent;
    updateSlot: (slotKey: keyof Intent["slots"], value: string) => void;
    updateRuleset: (key: string, value: any) => void;
    onCommit: () => void;
    isActive: boolean;
    href: string;
}

export default function IntentCard({
    intent,
    updateSlot,
    updateRuleset,
    onCommit,
    isActive,
}: IntentCardProps) {
    return (
        <div
            className={`relative h-[580px] w-full flex flex-col rounded-[32px] overflow-hidden transition-all duration-500 ease-out border backdrop-blur-2xl ${isActive
                ? "bg-[#0B0F29]/80 border-cyan-400/30 shadow-[0_0_80px_-20px_rgba(0,163,218,0.4)] scale-100 opacity-100 z-10 ring-1 ring-cyan-400/20"
                : "bg-[#050812]/40 border-white/5 shadow-none scale-[0.92] opacity-50 grayscale-[0.8] hover:opacity-70 hover:scale-[0.94]"
                }`}
        >
            {/* Dynamic Background Mesh */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"
                    }`}
            />

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

            <div className="relative z-10 flex-1 flex flex-col p-8 sm:p-10 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-5">
                    <div className={`
            h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500
            ${isActive ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "bg-white/5 text-slate-500"}
          `}>
                        <div className={`w-6 h-6 rounded-full border-[3px] ${isActive ? "border-cyan-400" : "border-slate-600"}`} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-cyan-200/50 mb-1">
                            Active Protocol
                        </p>
                        <p className={`text-lg font-bold tracking-wide transition-colors ${isActive ? "text-white" : "text-slate-500"}`}>
                            {intent.label}
                        </p>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-4">
                    <h1 className={`text-5xl font-black leading-[1.05] tracking-tight transition-colors duration-300 ${isActive ? "text-white drop-shadow-xl" : "text-slate-600"}`}>
                        {intent.type === "AI" && "Survive The Machine"}
                        {intent.type === "2P" && "Face Your Rival"}
                        {intent.type === "4P" && "Team Warfare"}
                    </h1>
                    <div className={`h-1.5 w-24 rounded-full transition-all duration-500 ${isActive ? "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.6)]" : "bg-slate-800"}`} />
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 flex flex-col justify-center space-y-5">
                    {intent.type === "AI" && (
                        <>
                            <Input
                                value={intent.slots.p1}
                                disabled={!isActive}
                                onChange={(e: any) => updateSlot("p1", e.target.value)}
                                placeholder="PROTAGONIST"
                                label="PLAYER 1"
                                className="bg-black/40 border-white/10 text-cyan-50 focus:border-cyan-400/50"
                            />
                            <SelectInput
                                value={intent.ruleset.difficulty}
                                disabled={!isActive}
                                onChange={(e: any) => updateRuleset("difficulty", e.target.value)}
                                label="DIFFICULTY CLASS"
                            >
                                <option value="easy">STANDARD</option>
                                <option value="medium">ADVANCED</option>
                                <option value="hard">NIGHTMARE</option>
                            </SelectInput>
                        </>
                    )}

                    {intent.type === "2P" && (
                        <>
                            <Input
                                value={intent.slots.p1}
                                disabled={!isActive}
                                onChange={(e: any) => updateSlot("p1", e.target.value)}
                                placeholder="PLAYER ONE"
                                label="CHALLENGER"
                                className="bg-black/40 border-white/10 text-cyan-50 focus:border-cyan-400/50"
                            />
                            <div className="flex items-center gap-4 px-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-cyan-200/50">VS</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                            </div>
                            <Input
                                value={intent.slots.p2}
                                disabled={!isActive}
                                onChange={(e: any) => updateSlot("p2", e.target.value)}
                                placeholder="PLAYER TWO"
                                label="OPPONENT"
                                className="bg-black/40 border-white/10 text-cyan-50 focus:border-cyan-400/50"
                            />
                        </>
                    )}

                    {intent.type === "4P" && (
                        <div className="grid grid-cols-2 gap-4">
                            {["p1", "p2", "p3", "p4"].map((slot, i) => (
                                <Input
                                    key={slot}
                                    value={intent.slots[slot as keyof Intent["slots"]]}
                                    disabled={!isActive}
                                    onChange={(e: any) => updateSlot(slot as keyof Intent["slots"], e.target.value)}
                                    placeholder={`UNIT 0${i + 1}`}
                                    label={`SQUAD MEMBER ${i + 1}`}
                                    className="bg-black/40 border-white/10 text-cyan-50 focus:border-cyan-400/50 text-sm"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className={!isActive ? "opacity-50 pointer-events-none grayscale" : ""}>
                    <Button
                        variant="hero"
                        size="lg"
                        fullWidth
                        onClick={onCommit}
                        disabled={!isActive}
                        className="font-bold tracking-[0.15em] uppercase shadow-[0_0_30px_-5px_rgba(8,145,178,0.5)]"
                    >
                        Initialize Match
                    </Button>
                </div>
            </div>
        </div>
    );
}
