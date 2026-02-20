import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
};

const BrandLogo = ({ className, imageClassName, labelClassName, showLabel = true }: BrandLogoProps) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/Polarist_logo.jpeg"
        alt={t("brand.logoAlt")}
        className={cn("h-10 w-10 rounded-sm border border-border object-cover", imageClassName)}
      />
      {showLabel ? (
        <span
          className={cn("font-body text-foreground", labelClassName)}
          style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "1rem" }}
        >
          {t("brand.name")}
        </span>
      ) : null}
    </div>
  );
};

export default BrandLogo;
