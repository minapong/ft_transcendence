import  Header  from "@/components/layout/Header";
import  LeftSidebar from "@/components/layout/LeftSidebar";

export default function RootLayout({ children }) {
  return (
    <div className="app-shell flex flex-col">
      <Header />
      <div className="flex">
          <LeftSidebar />
          <main className="main-pane flex-1">{children}</main>
      </div>
    </div>
  );
}
