import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type PageFocusOverlayContextValue = {
  isPageFocusOverlayOpen: boolean;
  setPageFocusOverlayOpen: (open: boolean) => void;
};

const PageFocusOverlayContext =
  createContext<PageFocusOverlayContextValue | null>(null);

export const PageFocusOverlayProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPageFocusOverlayOpen, setPageFocusOverlayOpen] = useState(false);
  const value = useMemo(
    () => ({ isPageFocusOverlayOpen, setPageFocusOverlayOpen }),
    [isPageFocusOverlayOpen],
  );

  return (
    <PageFocusOverlayContext.Provider value={value}>
      {children}
    </PageFocusOverlayContext.Provider>
  );
};

export const usePageFocusOverlay = () => {
  const context = useContext(PageFocusOverlayContext);

  if (!context) {
    throw new Error(
      "usePageFocusOverlay must be used within PageFocusOverlayProvider",
    );
  }

  return context;
};

export const PageFocusOverlay = () => {
  const { isPageFocusOverlayOpen, setPageFocusOverlayOpen } =
    usePageFocusOverlay();

  return (
    <AnimatePresence>
      {isPageFocusOverlayOpen ? (
        <motion.button
          type="button"
          aria-label="Cerrar comunidad"
          className="absolute inset-0 z-30 cursor-default bg-black/35 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={() => setPageFocusOverlayOpen(false)}
        />
      ) : null}
    </AnimatePresence>
  );
};
