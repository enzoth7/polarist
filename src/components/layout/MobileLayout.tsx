import { Outlet } from "react-router-dom";
import MobileNav from "./MobileNav";
import Header from "./Header";

const MobileLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted/40 items-center justify-center">
      {/* App Container */}
      <div 
        id="polarist-app-container"
        className="flex flex-col mx-auto max-w-md w-full h-full sm:h-[95vh] sm:rounded-2xl overflow-hidden bg-background relative sm:border sm:border-border sm:shadow-2xl"
        style={{ transform: "translateZ(0)" }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom,16px)+64px] relative scroll-smooth">
          <Outlet />
        </main>
        
        <div className="absolute bottom-0 w-full z-40 pointer-events-none">
          <div className="w-full h-full pointer-events-auto">
            <MobileNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
