import { useState, useEffect } from "Reactor";
import Header from "@/app/components/layout/Header";
import LeftSidebar from "@/app/components/layout/LeftSidebar";
import ModalRoot from "Reactor/ModalRoot";

export type ScreenSize = "mobile" | "tablet" | "desktop";

export default function RootLayout({ children }) {
  const [screen, setScreen] = useState<ScreenSize>("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setScreen("mobile");
      else if (w < 1024) setScreen("tablet");
      else setScreen("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br text-slate-100 from-start via-mid to-end grid grid-rows-[auto_1fr]">
      <Header screen={screen} />

      <div className="flex flex-1">
        <LeftSidebar
          screen={screen}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <main
          id="spa-root"
          className="flex-1 relative overflow-hidden"
        >
          {children}
        </main>
      </div>

      <ModalRoot />
    </div>
  );
}