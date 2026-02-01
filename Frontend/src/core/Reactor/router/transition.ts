
/**
 * Route Transition Controller
 * Handles the global top-bar animation between route swaps.
 */

const TRANSITION_ID = "route-transition";
const ANIMATION_CLASS = "is-animating";
const FINISHING_CLASS = "is-finishing";

interface TransitionOpts {
    direction?: "forward" | "backward";
    weight?: "heavy" | "normal";
}

/**
 * Starts the transition animation.
 * narrative: explode fast, slow slightly near 70%.
 */
export function startTransition(opts: TransitionOpts = {}): Promise<void> {
    const { direction = "forward", weight = "normal" } = opts;

    return new Promise((resolve) => {
        const overlay = document.getElementById(TRANSITION_ID);
        if (!overlay) return resolve();

        const bar = overlay.querySelector(".route-bar") as HTMLElement;
        if (!bar) return resolve();

        // Direction awareness: feels spatial
        bar.style.transformOrigin = direction === "forward" ? "left" : "right";

        // Weight-based timing: feels context-aware
        const duration = weight === "heavy" ? "0.38s" : "0.28s";
        bar.style.transitionDuration = duration;

        // Reset state
        bar.style.transition = "none";
        overlay.classList.remove(ANIMATION_CLASS, FINISHING_CLASS);
        void bar.offsetWidth; // force reflow
        bar.style.transition = "";

        // Start sweep
        overlay.classList.add(ANIMATION_CLASS);

        const onTransitionEnd = (e: TransitionEvent) => {
            if (e.propertyName === "transform") {
                bar.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            }
        };

        bar.addEventListener("transitionend", onTransitionEnd);
        setTimeout(resolve, 500); // Safety fallback
    });
}

/**
 * Ends the transition (Commit phase).
 * narrative: confirmation pulse + clean exit.
 */
export function endTransition(): Promise<void> {
    return new Promise((resolve) => {
        const overlay = document.getElementById(TRANSITION_ID);
        if (!overlay) return resolve();

        const bar = overlay.querySelector(".route-bar") as HTMLElement;
        if (!bar) return resolve();

        // Phase 1: Commitment! (Fires the pulse animation from CSS)
        overlay.classList.add(FINISHING_CLASS);

        // Wait for the commit pulse and scale to finish
        setTimeout(() => {
            requestAnimationFrame(() => {
                overlay.style.opacity = "0";
                overlay.style.transition = "opacity 0.25s ease-out";

                setTimeout(() => {
                    // Reset everything silently while hidden
                    bar.style.transition = "none";
                    overlay.classList.remove(ANIMATION_CLASS, FINISHING_CLASS);
                    void bar.offsetWidth;

                    overlay.style.opacity = "";
                    overlay.style.transition = "";

                    setTimeout(() => {
                        bar.style.transition = "";
                        resolve();
                    }, 50);
                }, 280);
            });
        }, 220);
    });
}
