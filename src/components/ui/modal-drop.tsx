"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X } from "@phosphor-icons/react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  allowEasyClose?: boolean
  title?: string
  subtitle?: string
  type?: "blur" | "overlay" | "none"
  showCloseButton?: boolean
  showEscText?: boolean
  borderBottom?: boolean
  className?: string
  /**
   * Choose between the default drop-in animation or a scale-from-center animation.
   * @default 'drop'
   */
  animationType?: "drop" | "scale"
  /**
   * Adjust the vertical position of the modal.
   * Positive values move it up, negative values move it down.
   * @default 0
   */
  position?: number
  /**
   * Disable default padding of the modal content.
   * @default false
   */
  disablePadding?: boolean
  /**
   * Force centered layout on mobile instead of bottom sheet.
   * @default false
   */
  centerOnMobile?: boolean
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

// Default drop-in from bottom
const dropVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 32,
      mass: 0.7,
      opacity: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
    },
  },
  exit: {
    opacity: 0,
    y: 24,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// Scale from center animation
const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 0.5,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  allowEasyClose = true,
  title,
  subtitle,
  type = "overlay",
  showCloseButton = true,
  showEscText = true,
  borderBottom = true,
  className,
  animationType = "scale",
  position = 0,
  disablePadding = false,
  centerOnMobile = false,
}) => {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && allowEasyClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, allowEasyClose, onClose])

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    if (isOpen) {
      const currentPaddingRight =
        Number.parseInt(getComputedStyle(document.body).paddingRight) || 0
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.style.paddingRight = ""
      document.body.classList.remove("overflow-hidden")
    }
    return () => {
      document.body.style.paddingRight = ""
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  const handleOverlayClick = () => {
    if (allowEasyClose) onClose()
  }

  const getOverlayClasses = () => {
    switch (type) {
      case "blur":
        return "bg-background/60 backdrop-blur-[2px]"
      case "overlay":
        return "bg-black/50"
      case "none":
        return "shadow-xl shadow-primary-foreground"
      default:
        return "bg-black/50"
    }
  }

  const getModalClasses = () => {
    const base =
      "w-auto bg-background border border-border text-card-foreground max-w-[90%] sm:max-w-xl rounded-2xl shadow-lg m-4 relative"

    // Mobile Bottom Sheet Classes
    const mobileClasses = "fixed bottom-0 left-0 right-0 m-0 max-w-full max-h-[85vh] overflow-y-auto overflow-x-hidden overscroll-contain rounded-t-[32px] rounded-b-none border-x-0 border-b-0 pb-10"

    if (isMobile && !centerOnMobile) return cn(base, mobileClasses)
    return type === "overlay" ? base : `${base} border border-border`
  }

  if (!mounted) return null

  // Choose the appropriate animation variants
  const bottomSheetVariants: Variants = {
    hidden: { y: "100%", opacity: 1 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", damping: 30, stiffness: 300 } 
    },
    exit: { 
      y: "100%", 
      opacity: 1,
      transition: { duration: 0.2 } 
    }
  }

  const variants = (isMobile && !centerOnMobile)
    ? bottomSheetVariants
    : (animationType === "scale" ? scaleVariants : dropVariants)

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "fixed inset-0 z-[100] flex",
            (isMobile && !centerOnMobile) ? "items-end overflow-hidden" : "items-center justify-center overflow-y-auto",
            getOverlayClasses()
          )}
          onClick={handleOverlayClick}
          style={{
            alignItems: (isMobile && !centerOnMobile) ? "flex-end" : (position === 0 ? "center" : "flex-start"),
            paddingTop: (isMobile && !centerOnMobile) ? 0 : (position === 0 ? 0 : `calc(50vh - ${position}px)`),
            willChange:
              type === "blur" ? "backdrop-filter, opacity" : undefined,
          }}
          layout={type === "blur"}
        >
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(getModalClasses(), className)}
            onClick={(e) => e.stopPropagation()}
            layout={type === "blur"}
          >
            {isMobile && !centerOnMobile && (
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20" />
            )}
            {title ? (
              <div
                className={cn(
                  "flex justify-between p-6 pb-4",
                  borderBottom && "border-b border-border",
                  subtitle ? "flex-col items-start gap-1" : "items-center"
                )}
              >
                <div>
                  <h2 
                    style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
                    className="text-xl font-semibold text-[#F6F6F6]"
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p 
                      style={{ fontFamily: 'var(--font-sequel, sans-serif)' }}
                      className="text-sm text-[#F6F6F6]/50 mt-1"
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      subtitle && "absolute top-6 right-6"
                    )}
                  >
                    <button
                      className="p-1 rounded-md hover:bg-white/10 text-[#F6F6F6] transition-colors"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <X size={20} weight="bold" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              showCloseButton && (
                <div className="absolute right-6 top-6 z-30 flex items-center gap-2">
                  <button
                    className="p-1 rounded-md hover:bg-white/10 text-[#F6F6F6] transition-colors"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <X size={20} weight="bold" />
                  </button>
                </div>
              )
            )}

            <div
              className={cn(!disablePadding && (!title ? "p-6 pt-12" : "p-6"))}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default Modal;
