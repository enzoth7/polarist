import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
};

const BrandLogo = ({ className, imageClassName, labelClassName, showLabel = true }: BrandLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/Polarist_logo.jpeg"
        alt="Logo de Polarist"
        className={cn("h-10 w-10 rounded-full border border-border object-cover", imageClassName)}
      />
      {showLabel ? (
        <span
          className={cn("font-body text-foreground", labelClassName)}
          style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: "1rem" }}
        >
          Polarist
        </span>
      ) : null}
    </div>
  );
};

export default BrandLogo;
