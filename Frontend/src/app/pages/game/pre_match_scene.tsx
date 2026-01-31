import { useState, useEffect, useRef } from "Reactor";
import { navigate } from "Reactor";
import { animate } from "motion";
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

  /* ---- CAROUSEL CONFIG ---- */
  const CARD_WIDTH = 460;
  const GAP = 48;

  /* ---- DRAG ENGINE ---- */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragX = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const animationRef = useRef<any>(null);

  const getTargetX = (idx: number) => {
    return `translateX(calc(50vw - ${idx * (CARD_WIDTH + GAP)}px - ${CARD_WIDTH / 2}px + var(--drag-offset, 0px)))`;
  };

  const updateDragOffset = (offset: number) => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty("--drag-offset", `${offset}px`);
  };

  const onPointerDown = (e: any) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
    isDragging.current = true;
    startX.current = e.clientX;
    dragX.current = 0;
    if (animationRef.current) animationRef.current.stop();
    if (containerRef.current) containerRef.current.style.transition = 'none';
  };

  const onPointerMove = (e: any) => {
    if (!isDragging.current) return;
    dragX.current = e.clientX - startX.current;
    updateDragOffset(dragX.current);
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const threshold = CARD_WIDTH / 4;
    let nextIndex = index;

    if (dragX.current < -threshold && index < intents.length - 1) {
      nextIndex = index + 1;
    } else if (dragX.current > threshold && index > 0) {
      nextIndex = index - 1;
    }

    if (containerRef.current) {
      containerRef.current.style.transition = ''; // Restore transition for snap
    }

    if (nextIndex !== index) {
      setIndex(nextIndex);
    } else {
      // Snap back to current index
      if (containerRef.current) {
        animationRef.current = animate(
          dragX.current,
          0,
          {
            duration: 0.4,
            ease: [0.2, 0.8, 0.2, 1],
            onUpdate: (v: number) => updateDragOffset(v)
          } as any
        );
      }
    }
  };

  // Synchronize UI when index changes
  useEffect(() => {
    updateDragOffset(0);
  }, [index]);

  const commit = () => {
    const activeRoute = intents[index].href;
    const intent = intents[index].state;

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
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "SELECT") {
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

  return (
    <section
      className="relative h-[calc(100vh-var(--header-height))] w-full flex flex-col justify-center overflow-hidden bg-black selection:bg-cyan-500/30 cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >

      {/* Deep Space Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0B0F29] via-[#02040a] to-black" />

      {/* Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_infinite]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px] mix-blend-screen animate-[pulse_12s_infinite]" />
      </div>

      <div className="relative w-full z-10 perspective-[1000px] touch-none">
        <div
          ref={containerRef}
          className="flex items-center transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
          style={{
            transform: getTargetX(index)
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
              onClick={() => {
                if (Math.abs(dragX.current) < 5) setIndex(i);
              }}
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
            Drag or Nav Keys
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
