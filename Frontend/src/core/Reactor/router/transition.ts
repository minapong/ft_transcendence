
/**
 * Route Transition Controller
 * Handles the global top-bar animation between route swaps.
 */

const TRANSITION_ID = "route-transition";
const ANIMATION_CLASS = "is-animating";

/**
 * Starts the transition animation (Animate OUT phase).
 * Resolves when the bar has filled up.
 */
export function startTransition(): Promise<void> {
    return new Promise((resolve) => {
        const overlay = document.getElementById(TRANSITION_ID);
        if (!overlay) {
            resolve();
            return;
        }

        const bar = overlay.querySelector(".route-bar") as HTMLElement;
        if (!bar) {
            resolve();
            return;
        }

        // Add the animating class to trigger CSS transition
        overlay.classList.add(ANIMATION_CLASS);

        // Wait for the transition to finish (0.4s as defined in CSS)
        const onTransitionEnd = (e: TransitionEvent) => {
            if (e.propertyName === "transform") {
                bar.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            }
        };

        bar.addEventListener("transitionend", onTransitionEnd);

        setTimeout(() => {
            bar.removeEventListener("transitionend", onTransitionEnd);
            resolve();
        }, 400);
    });
}

/**
 * Ends the transition animation (Animate IN phase).
 * Resets the bar state instantly so it's ready for the next transition.
 */
export function endTransition(): Promise<void> {
    return new Promise((resolve) => {
        const overlay = document.getElementById(TRANSITION_ID);
        if (!overlay) {
            resolve();
            return;
        }

        const bar = overlay.querySelector(".route-bar") as HTMLElement;
        if (!bar) {
            resolve();
            return;
        }

        // Phase 1: Ensure it's 100% (already should be, but just in case)
        overlay.classList.add(ANIMATION_CLASS);

        // Phase 2: Fade out overlay then reset scale
        // We use requestAnimationFrame to ensure states are applied correctly
        requestAnimationFrame(() => {
            overlay.style.opacity = "0";
            overlay.style.transition = "opacity 0.15s ease-out";

            setTimeout(() => {
                // Remove animating class but disable transition on bar first
                // so it doesn't "animate back" while opacity is resetting
                bar.style.transition = "none";
                overlay.classList.remove(ANIMATION_CLASS);

                // Force a reflow to ensure the 'none' transition is applied
                void bar.offsetWidth;

                // Reset overlay styles
                overlay.style.opacity = "";
                overlay.style.transition = "";

                // Restore bar transition for the next startTransition call
                setTimeout(() => {
                    bar.style.transition = "";
                    resolve();
                }, 50);
            }, 180);
        });
    });
}
