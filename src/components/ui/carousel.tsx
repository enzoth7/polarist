import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Report {
  id: string;
  quarter: string;
  period: string;
  imageSrc: string;
  isNew?: boolean;
}

interface ShareholderReportsProps extends React.HTMLAttributes<HTMLDivElement> {
  reports: Report[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ShareholderReports = React.forwardRef<
  HTMLDivElement,
  ShareholderReportsProps
>(
  (
    {
      reports,
      title = "Shareholders' Letter and Results",
      subtitle = "Powering India's changing lifestyles",
      className,
      ...props
    },
    ref,
  ) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    const checkScrollability = React.useCallback(() => {
      const container = scrollContainerRef.current;
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    }, []);

    React.useEffect(() => {
      const container = scrollContainerRef.current;
      if (container) {
        checkScrollability();
        container.addEventListener("scroll", checkScrollability);
      }

      return () => {
        if (container) {
          container.removeEventListener("scroll", checkScrollability);
        }
      };
    }, [reports, checkScrollability]);

    const scroll = (direction: "left" | "right") => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <section
        ref={ref}
        className={cn("mx-auto w-full max-w-7xl py-8", className)}
        aria-labelledby="reports-heading"
        {...props}
      >
        <div className="mb-4 flex items-center justify-between px-4 sm:px-6">
          <h2
            id="reports-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            {title}
          </h2>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={cn(
                "rounded-full border border-border bg-card p-2 text-card-foreground transition-opacity duration-300 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30",
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={cn(
                "rounded-full border border-border bg-card p-2 text-card-foreground transition-opacity duration-300 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30",
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex snap-x snap-mandatory space-x-4 overflow-x-auto scroll-smooth px-4 sm:px-6 md:space-x-6"
        >
          {reports.map((report) => (
            <div
              key={report.id}
              className="w-[240px] flex-shrink-0 snap-start sm:w-[280px]"
            >
              <div className="group cursor-pointer">
                <div className="relative mb-3 overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-lg">
                  <img
                    src={report.imageSrc}
                    alt={`Report for ${report.quarter}`}
                    className="h-[320px] w-full object-cover sm:h-[380px]"
                  />
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Shareholders&apos; Letter and Results
                      </h3>
                      <p className="text-xs text-white/80">{report.period}</p>
                    </div>
                    <p className="text-sm font-medium">{subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-semibold text-foreground sm:text-base">
                    {report.quarter}
                  </h4>
                  {report.isNew ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      NEW
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  },
);

ShareholderReports.displayName = "ShareholderReports";
