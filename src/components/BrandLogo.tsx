import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
};

const BrandLogo = ({ className, imageClassName }: BrandLogoProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/Polarist_logo.png"
        alt="Logo de Polarist"
        className={cn("h-8 w-auto object-contain", imageClassName)}
      />
    </div>
  );
};

export default BrandLogo;
