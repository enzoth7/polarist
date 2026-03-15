import { Outlet } from "react-router-dom";
import MobileNav from "./MobileNav";
import Header from "./Header";

const MobileLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pb-16">
        {/* pb-16 to avoid content being hidden under the bottom nav */}
        <div className="mx-auto max-w-md w-full min-h-full sm:border-x sm:border-border sm:shadow-sm">
          <Outlet />
        </div>
      </main>
      <div className="fixed bottom-0 w-full z-50 pointer-events-none">
        <div className="mx-auto max-w-md w-full h-full pointer-events-auto sm:border-x sm:border-border">
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
