import { useState, useEffect } from "Reactor";
import Header from "@/app/components/layout/Header";
import LeftSidebar from "@/app/components/layout/LeftSidebar";
import ModalRoot from "Reactor/ModalRoot";

export default function RootLayout({ children }) {
  const mq = window.matchMedia("(min-width: 1024px)");
  const [isDesktop, setIsDesktop] = useState(mq.matches);
  const [isOverlayOpen, setIsOverlayOpen] = useState(mq.matches);

  useEffect(() => {
	const mq = window.matchMedia("(min-width: 1024px)");
	const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleNavigate = () => {
    if (!isDesktop) setIsOverlayOpen(false);
  };

  const pathname = window.location.pathname;
  const isGameRoute = pathname.startsWith("/game");
  const hideSidebar = isGameRoute || pathname.startsWith("/auth") || pathname === "/login";


  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <Header minimal={isGameRoute} />

      <div className="flex flex-1">
        {!hideSidebar && (
          <LeftSidebar
            isOverlayOpen={isOverlayOpen}
            setIsOverlayOpen={setIsOverlayOpen}
            onNavigate={handleNavigate}
          />
        )}

        <main id="spa-root" className="flex-1">{children}</main>
      </div>

      <ModalRoot />
    </div>
  );
}
