import { useState } from "Reactor";
import { useLocation } from "Reactor/router/useLocation";
import Header from "@/app/components/layout/Header";
import LeftSidebar from "@/app/components/layout/LeftSidebar";
import ModalRoot from "Reactor/ModalRoot";
import { useScreen } from "@/app/hooks/useScreen";

export default function RootLayout({ children }) {
  const screen = useScreen();
  const sidebarMode = screen === "desktop" ? "static" : "overlay";
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const pathname = useLocation();

  const handleNavigate = () => {
    if (sidebarMode === "overlay") setIsOverlayOpen(false);
  };

  const isGameRoute = pathname.startsWith("/game");
  const hideSidebar = false
  //    isGameRoute || pathname.startsWith("/auth") || pathname === "/login";
  console.log("[RootLayout] screen:", screen, "sidebarMode:", sidebarMode, "isOverlayOpen:", isOverlayOpen);
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <Header
        onMenuToggle={() => setIsOverlayOpen(v => !v)}
        showMenuButton={!hideSidebar}
      />

      <div className="flex flex-1">
        {!hideSidebar && (
          <LeftSidebar
            mode={sidebarMode}
            isOverlayOpen={sidebarMode === "overlay" ? isOverlayOpen : false}
            setIsOverlayOpen={sidebarMode === "overlay" ? setIsOverlayOpen : () => {}}
            onNavigate={handleNavigate}
          />
        )}

        <main id="spa-root" className="flex-1">{children}</main>
      </div>

      <ModalRoot />
    </div>
  );
}
