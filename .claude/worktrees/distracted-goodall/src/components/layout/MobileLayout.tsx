import { useEffect, useRef, type TouchEvent } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { routes } from "@/lib/routes";

import Footer from "./Footer";
import Header from "./Header";

const MobileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const swipeStartXRef = useRef<number | null>(null);
  const swipeStartYRef = useRef<number | null>(null);
  const mainScrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const resetSwipeGesture = () => {
    swipeStartXRef.current = null;
    swipeStartYRef.current = null;
  };

  const handleAppTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touchPoint = event.touches[0];

    if (touchPoint.clientX > 28) {
      resetSwipeGesture();
      return;
    }

    swipeStartXRef.current = touchPoint.clientX;
    swipeStartYRef.current = touchPoint.clientY;
  };

  const handleAppTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const startX = swipeStartXRef.current;
    const startY = swipeStartYRef.current;

    if (startX === null || startY === null) {
      return;
    }

    const touchPoint = event.changedTouches[0];
    const deltaX = touchPoint.clientX - startX;
    const deltaY = Math.abs(touchPoint.clientY - startY);

    if (deltaX > 70 && deltaY < 50) {
      if (window.history.length > 1) {
        navigate(-1);
      } else if (location.pathname !== routes.appRadar) {
        navigate(routes.appRadar);
      }
    }

    resetSwipeGesture();
  };

  return (
    <div className="app-shell-backdrop min-h-screen">
      <div
        id="polarist-app-container"
        className="relative flex h-screen w-full flex-col overflow-hidden bg-background"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header />

          <main
            ref={mainScrollRef}
            className="relative flex-1 overflow-y-auto pb-8 md:pb-10"
            onTouchStart={handleAppTouchStart}
            onTouchEnd={handleAppTouchEnd}
            onTouchCancel={resetSwipeGesture}
          >
            <div className="flex min-h-full flex-col">
              <div className="flex-1">
                <Outlet />
              </div>
              <Footer className="mt-auto pb-8" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
