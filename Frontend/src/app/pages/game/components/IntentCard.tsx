import { Intent } from "@/core/engine/match_intent";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import SelectInput from "@/app/components/ui/SelectInput";
import { useScreen } from "@/app/hooks/useScreen";

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
    const screenSize = useScreen();
    const isMobile = screenSize === "mobile";
    const isTablet = screenSize === "tablet";

    // Dynamic Sizing Map
    const styles = {
        height: isMobile ? "h-[450px]" : isTablet ? "h-[520px]" : "h-[580px]",
        padding: isMobile ? "p-6" : isTablet ? "p-8" : "p-10",
        gap: isMobile ? "space-y-4" : "space-y-8",
        title: isMobile ? "text-3xl" : isTablet ? "text-4xl" : "text-5xl",
        headerIcon: isMobile ? "h-12 w-12" : "h-14 w-14",
        inputGap: isMobile ? "space-y-3" : "space-y-5"
    };

    return (
        <div
            className={`relative w-full flex flex-col rounded-[32px] overflow-hidden transition-all duration-500 ease-out border backdrop-blur-2xl ${styles.height
                } ${isActive
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

            {/* Interaction Mask for Inactive Cards */}
            {!isActive && (
                <div
                    className="absolute inset-0 z-[100] cursor-pointer bg-transparent"
                    aria-hidden="true"
                />
            )}

            <div className={`relative z-10 flex-1 flex flex-col ${styles.padding} ${styles.gap}`}>
                {/* Header */}
                <div className="flex items-center gap-5">
                    <div className={`
            ${styles.headerIcon} rounded-2xl flex items-center justify-center transition-all duration-500
            ${isActive ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "bg-white/5 text-slate-500"}
          `}>
                        <div className={`w-5 h-5 rounded-full border-[3px] ${isActive ? "border-cyan-400" : "border-slate-600"}`} />
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
                <div className={isMobile ? "space-y-2" : "space-y-4"}>
                    <h1 className={`font-black leading-[1.05] tracking-tight transition-colors duration-300 ${styles.title
                        } ${isActive ? "text-white drop-shadow-xl" : "text-slate-600"}`}>
                        {intent.type === "AI" && "Survive The Machine"}
                        {intent.type === "2P" && "Face Your Rival"}
                        {intent.type === "4P" && "Team Warfare"}
                    </h1>
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${isMobile ? "w-12" : "w-24"} ${isActive ? "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.6)]" : "bg-slate-800"}`} />
                </div>

                {/* Dynamic Content Area — Form-style submission */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className={`flex-1 flex flex-col justify-center ${styles.inputGap}`}>
                        {intent.type === "AI" && (
                            <>
                                <Input
                                    id={`${intent.type.toLowerCase()}-p1`}
                                    value={intent.slots.p1}
                                    disabled={!isActive}
                                    onChange={(e: any) => updateSlot("p1", e.target.value)}
                                    placeholder="Player 1"
                                    label="PLAYER 1"
                                    className="bg-black/40 border-white/10 text-cyan-50 focus:border-cyan-400/50"
                                />
                                <SelectInput
                                    id={`${intent.type.toLowerCase()}-difficulty`}
                                    value={intent.ruleset.difficulty}
                                    disabled={!isActive}
                                    onChange={(e: any) => updateRuleset("difficulty", e.target.value)}
                                    label="DIFFICULTY"
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
                                    id={`${intent.type.toLowerCase()}-p1`}
                                    value={intent.slots.p1}
                                    disabled={!isActive}
                                    onChange={(e: any) => updateSlot("p1", e.target.value)}
                                    placeholder="Player 1"
                                    label="P1"
                                    className="bg-black/40 border-white/10 text-cyan-50 focus:border-cyan-400/50"
                                />
                                <div className={`flex items-center gap-4 px-2 ${isMobile ? "hidden" : "flex"}`}>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                                    <span className="text-[10px] font-black tracking-[0.2em] text-cyan-200/50">VS</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                                </div>
                                <Input
                                    id={`${intent.type.toLowerCase()}-p2`}
                                    value={intent.slots.p2}
                                    disabled={!isActive}
                                    onChange={(e: any) => updateSlot("p2", e.target.value)}
                                    placeholder="Player 2"
                                    label="P2"
                                    className="bg-black/40 border-white/10 text-cyan-50 focus:border-cyan-400/50"
                                />
                            </>
                        )}

                        {intent.type === "4P" && (
                            <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                                {["p1", "p2", "p3", "p4"].map((slot, i) => (
                                    <Input
                                        key={slot}
                                        id={`${intent.type.toLowerCase()}-${slot}`}
                                        value={intent.slots[slot as keyof Intent["slots"]]}
                                        disabled={!isActive}
                                        onChange={(e: any) => updateSlot(slot as keyof Intent["slots"], e.target.value)}
                                        placeholder={`Player ${i + 1}`}
                                        label={isMobile ? `P${i + 1}` : `MEMBER ${i + 1}`}
                                        className="bg-black/40 border-white/10 text-cyan-50 focus:border-cyan-400/50 text-xs"
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
                            disabled={!isActive}
                            onMouseDown={(e: any) => {
                                // Prevent blur which causes focus-stealing re-render
                                e.preventDefault();
                                if (isActive) onCommit();
                            }}
                            className="font-bold tracking-[0.15em] uppercase shadow-[0_0_30px_-5px_rgba(8,145,178,0.5)]"
                        >
                            Initialize Match
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
