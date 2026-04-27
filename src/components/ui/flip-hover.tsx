import { useState, type CSSProperties, type ReactNode } from "react";

interface FlipHoverProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const FlipHover = ({ children, className = "", style }: FlipHoverProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleHover = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setTimeout(() => setIsFlipped(false), 700);
    }
  };

  return (
    <div className={`[perspective:1000px] ${className}`} style={style} onMouseEnter={handleHover}>
      <div
        className={`relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)_translateY(-40px)]" : "[transform:rotateY(0deg)_translateY(0px)]"
        }`}
      >
        <div className="absolute inset-0 h-full w-full rounded-[inherit] [backface-visibility:hidden]">
          {children}
        </div>
        <div className="absolute inset-0 h-full w-full rounded-[inherit] [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FlipHover;
