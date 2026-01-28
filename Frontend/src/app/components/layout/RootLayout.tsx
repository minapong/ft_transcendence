import { useState, useEffect } from "Reactor";
import { useLocation } from "Reactor/router/useLocation";
import Header from "@/app/components/layout/Header";
import LeftSidebar from "@/app/components/layout/LeftSidebar";
import ModalRoot from "Reactor/ModalRoot";
import { useScreen } from "@/app/hooks/useScreen";

export default function RootLayout({ children }) {
  const screen = useScreen();
  const sidebarMode = screen === "desktop" ? "static" : "overlay";
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = useLocation();

  // Reset collapsed state when leaving desktop
  useEffect(() => {
    if (sidebarMode !== "static") {
      setIsCollapsed(false);
    }
  }, [sidebarMode]);

  const handleNavigate = () => {
    if (sidebarMode === "overlay") setIsOverlayOpen(false);
  };

  const handleToggle = () => {
    if (sidebarMode === "overlay") {
      setIsOverlayOpen(v => !v);
    } else {
      setIsCollapsed(v => !v);
    }
  };

  const isGameRoute = pathname.startsWith("/game");
  const hideSidebar = false
  //    isGameRoute || pathname.startsWith("/auth") || pathname === "/login";
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        onMenuToggle={handleToggle}
        showMenuButton={!hideSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        {!hideSidebar && (
          <LeftSidebar
            mode={sidebarMode}
            isCollapsed={isCollapsed}
            isOverlayOpen={isOverlayOpen}
            setIsOverlayOpen={setIsOverlayOpen}
            onNavigate={handleNavigate}
          />
        )}

        <main id="spa-root" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <ModalRoot />
    </div>
  );
}
