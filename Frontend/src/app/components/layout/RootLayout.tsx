import { useState, useEffect } from "Reactor";
import { useLocation } from "Reactor/router/useLocation";

import Header from "@/app/components/layout/Header";
import LeftSidebar from "@/app/components/layout/LeftSidebar";
import ModalRoot from "Reactor/ModalRoot";
import { isSpecialLayout } from "Reactor/router/routes";
import { useScreen } from "@/app/hooks/useScreen";

export default function RootLayout({ children }) {
  const screen = useScreen();
  const sidebarMode = screen === "desktop" ? "static" : "overlay";
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const pathname = useLocation();

  // Reset states when switching modes
  useEffect(() => {
    if (sidebarMode === "static") {
      setIsOverlayOpen(false);
    } else {
      setIsSidebarHidden(false);
    }
  }, [sidebarMode]);

  // LeftSidebar handles its own navigation and closing in overlay mode

  const handleToggle = () => {
    if (sidebarMode === "overlay") {
      if (isOverlayOpen) {
        window.dispatchEvent(new Event("sidebar:close"));
      } else {
        setIsOverlayOpen(true);
      }
    } else {
      // On desktop, toggle sidebar visibility
      setIsSidebarHidden(v => !v);
    }
  };

  const hideSidebar = isSpecialLayout(pathname);
  console.log(`[RootLayout] Render: path="${pathname}", hideSidebar=${hideSidebar}, mode=${sidebarMode}, hidden=${hideSidebar || (sidebarMode === "static" && isSidebarHidden)}`);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        onMenuToggle={handleToggle}
        isSpecialPage={hideSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          mode={sidebarMode}
          isOverlayOpen={isOverlayOpen}
          setIsOverlayOpen={setIsOverlayOpen}
          hidden={hideSidebar || (sidebarMode === "static" && isSidebarHidden)}
        />

        <main id="spa-root" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <ModalRoot />

      {/* Global Route Transition Overlay */}
      <div id="route-transition" aria-hidden="true">
        <div className="route-bar"></div>
      </div>
    </div>
  );
}
