import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import MobileNav from "./MobileNav";

const MobileLayout = () => {
  return (
    <div className="app-shell-backdrop min-h-screen">
      <div
        id="polarist-app-container"
        className="relative flex h-screen w-full flex-col overflow-hidden bg-background"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header />

          <main className="relative flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom,16px)+72px)] md:pb-10">
            <div className="flex min-h-full flex-col">
              <div className="flex-1">
                <Outlet />
              </div>
              <Footer className="mt-auto pb-24 md:pb-8" />
            </div>
          </main>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none md:hidden">
          <div className="pointer-events-auto w-full">
            <MobileNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
