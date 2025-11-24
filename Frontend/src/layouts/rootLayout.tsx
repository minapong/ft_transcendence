import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div className="app-shell flex flex-col">
      <Header />
      <div className="shell-body flex flex-1 ">
        <Sidebar className="main-pane flex-1"/>
        <main className="main-pane flex-1">{children}</main>
      </div>
    </div>
  );
}
