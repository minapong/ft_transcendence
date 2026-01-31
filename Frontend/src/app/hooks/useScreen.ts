import { useState, useEffect } from "Reactor";

export type ScreenSize = "mobile" | "tablet" | "desktop";

export function useScreen(): ScreenSize {
    // Initialize state synchronously if possible, otherwise default to desktop (SSR safe)
    const [screen, setScreen] = useState<ScreenSize>((() => {
        if (typeof window === "undefined") return "desktop";
        if (window.matchMedia("(min-width: 1024px)").matches) return "desktop";
        if (window.matchMedia("(min-width: 640px)").matches) return "tablet";
        return "mobile";
    })());

    useEffect(() => {
        const mobile = window.matchMedia("(max-width: 639px)");
        const tablet = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
        const desktop = window.matchMedia("(min-width: 1024px)");

        const update = () => {
            if (desktop.matches) setScreen("desktop");
            else if (tablet.matches) setScreen("tablet");
            else setScreen("mobile");
        };

        // Initial check in case it changed between render and effect
        update();

        mobile.addEventListener("change", update);
        tablet.addEventListener("change", update);
        desktop.addEventListener("change", update);

        return () => {
            mobile.removeEventListener("change", update);
            tablet.removeEventListener("change", update);
            desktop.removeEventListener("change", update);
        };
    }, []);

    return screen;
}
