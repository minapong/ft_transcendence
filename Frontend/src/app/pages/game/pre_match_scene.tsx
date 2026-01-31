import { useState, useEffect } from "Reactor";
import { navigate } from "Reactor";
import { IntentPresets } from "@/core/engine/match_intent";
import IntentCard from "./components/IntentCard";


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
