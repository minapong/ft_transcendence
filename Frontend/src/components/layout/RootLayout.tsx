import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import ModalRoot from "@/Reactor/ModalRoot";

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br text-slate-100 from-start via-mid to-end grid grid-rows-[auto_1fr]">
      <Header />

      <div className="flex flex-1">
        <LeftSidebar />

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