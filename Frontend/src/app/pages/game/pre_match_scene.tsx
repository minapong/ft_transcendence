import { useState, useEffect } from "Reactor";
import { navigate } from "Reactor";
import { Intent, IntentPresets, Difficulty } from "@/core/engine/match_intent";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";

/* ============================================================
   IntentCard — Glassmorphic, immersive
   ============================================================ */

interface IntentCardProps {
  intent: Intent;
  updateSlot: (slotKey: keyof Intent["slots"], value: string) => void;
  updateRuleset: (key: string, value: any) => void;
  onCommit: () => void;
  isActive: boolean;
  href: string;
}

function IntentCard({
  intent,
  updateSlot,
  updateRuleset,
  onCommit,
  isActive,
  href
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

/* --- Styled Select Component (Matches Input.tsx) --- */

const SelectInput = ({ value, onChange, disabled, children, label }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label className="input-label">
        {label}
      </label>
    )}
    <div className="relative fx-energy energy-low focus-within:energy-medium transition-all duration-300 rounded-lg">
      <select
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="input-shell appearance-none cursor-pointer bg-black/40 border-white/10 text-cyan-50"
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/50">
        ▼
      </div>
    </div>
  </div>
);


/* ============================================================
   PreMatchScene — PS-style Intent Carousel
   ============================================================ */

export default function PreMatchScene() {
  const [index, setIndex] = useState(0);

  const [solo, setSolo] = useState(IntentPresets.AI());
  const [duel, setDuel] = useState(IntentPresets["2P"]());
  const [squad, setSquad] = useState(IntentPresets["4P"]());

  // Define intents with their specific routes
  const intents = [
    { state: solo, set: setSolo, href: "/game/ai" },
    { state: duel, set: setDuel, href: "/game/pong" },
    { state: squad, set: setSquad, href: "/game/4p_pong" },
  ];

  const commit = () => {
    const activeRoute = intents[index].href;
    const intent = intents[index].state;

    // Transform Intent (Storage Shape) -> Navigation State (Game Engine Shape)
    let navState: any = {};

    if (intent.type === "AI") {
      navState = {
        mode: "ai",
        p1: intent.slots.p1,
        difficulty: intent.ruleset.difficulty || "medium"
      };
    } else if (intent.type === "2P") {
      navState = {
        mode: "2p",
        p1: intent.slots.p1,
        p2: intent.slots.p2
      };
    } else if (intent.type === "4P") {
      navState = {
        mode: "4p",
        p1: intent.slots.p1,
        p2: intent.slots.p2,
        p3: intent.slots.p3,
        p4: intent.slots.p4
      };
    }

    navigate(activeRoute, { state: navState });
  };

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore keys if user is typing in an input
      if (document.activeElement?.tagName === "INPUT") {
        if (e.key === "Enter") commit();
        return;
      }

      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIndex((i) => Math.min(intents.length - 1, i + 1));
      if (e.key === "Enter") commit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, intents]);

  /* ---- CAROUSEL CONFIG ---- */
  const CARD_WIDTH = 460;
  const GAP = 48;

  return (
    <section className="relative h-[calc(100vh-var(--header-height))] w-full flex flex-col justify-center overflow-hidden bg-black selection:bg-cyan-500/30">

      {/* Deep Space Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0B0F29] via-[#02040a] to-black" />

      {/* Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_infinite]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px] mix-blend-screen animate-[pulse_12s_infinite]" />
      </div>

      <div className="relative w-full z-10 perspective-[1000px]">
        <div
          className="flex items-center transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
          style={{
            transform: `translateX(calc(50vw - ${index * (CARD_WIDTH + GAP)}px - ${CARD_WIDTH / 2}px))`
          }}
        >
          {intents.map((entry, i) => (
            <div
              key={entry.state.type}
              className="flex-shrink-0 transition-all duration-500 will-change-transform"
              style={{
                width: CARD_WIDTH,
                marginRight: i === intents.length - 1 ? 0 : GAP
              }}
              onClick={() => setIndex(i)}
            >
              <IntentCard
                intent={entry.state}
                href={entry.href}
                updateSlot={(k, v) =>
                  entry.set({
                    ...entry.state,
                    slots: { ...entry.state.slots, [k]: v },
                  })
                }
                updateRuleset={(k, v) =>
                  entry.set({
                    ...entry.state,
                    ruleset: { ...entry.state.ruleset, [k]: v },
                  })
                }
                onCommit={commit}
                isActive={i === index}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
        <div className="inline-flex items-center gap-6 px-6 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
          <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Navigate
          </span>
          <div className="flex gap-1">
            <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-white/50 text-xs shadow-lg">←</div>
            <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-white/50 text-xs shadow-lg">→</div>
          </div>
        </div>
      </div>
    </section>
  );
}
