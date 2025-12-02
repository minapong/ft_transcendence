import  Header  from "@/components/layout/Header";
import  LeftSidebar from "@/components/layout/LeftSidebar";

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br text-slate-100 from-start via-mid to-end flex flex-col">
      <Header />
      <div className="flex">
          <LeftSidebar />
          <main id="spa-root" className=" flex-1">{children}</main>
      </div>
    </div>
  );
}
