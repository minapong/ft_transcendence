import { useState } from "Reactor";
import { useLocation } from "Reactor/router/useLocation";
import Header from "@/app/components/layout/Header";
import LeftSidebar from "@/app/components/layout/LeftSidebar";
import ModalRoot from "Reactor/ModalRoot";
import { useScreen } from "@/app/hooks/useScreen";

export default function RootLayout({ children }) {
  const screen = useScreen();
  const isDesktop = screen === "desktop";
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const pathname = useLocation();

  const handleNavigate = () => {
    if (!isDesktop) setIsOverlayOpen(false);
  };

  const isGameRoute = pathname.startsWith("/game");
  const hideSidebar = false
  //    isGameRoute || pathname.startsWith("/auth") || pathname === "/login";
  console.log("[RootLayout] screen:", screen, "isOverlayOpen:", isOverlayOpen);
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <Header
        onMenuToggle={() => setIsOverlayOpen(v => !v)}
        showMenuButton={!hideSidebar}
      />

      <div className="flex flex-1">
        {!hideSidebar && (
          isDesktop ? (
            <LeftSidebar
              mode="static"
              isOverlayOpen={false}
              setIsOverlayOpen={() => { }}
              onNavigate={handleNavigate}
            />
          ) : (
            <LeftSidebar
              mode="overlay"
              isOverlayOpen={isOverlayOpen}
              setIsOverlayOpen={setIsOverlayOpen}
              onNavigate={handleNavigate}
            />
          )
        )}

        <main id="spa-root" className="flex-1">{children}</main>
      </div>

      <ModalRoot />
    </div>
  );
}
