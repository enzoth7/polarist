import { Bookmark, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToolInteractionButtonsProps = {
  favoriteActive: boolean;
  favoriteCount: number;
  favoritePending?: boolean;
  saveActive: boolean;
  savePending?: boolean;
  onFavoriteClick: () => void;
  onSaveClick: () => void;
  className?: string;
};

const compactNumberFormatter = new Intl.NumberFormat("es", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function ToolInteractionButtons({
  favoriteActive,
  favoriteCount,
  favoritePending = false,
  saveActive,
  savePending = false,
  onFavoriteClick,
  onSaveClick,
  className,
}: ToolInteractionButtonsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-1", className)}>
      <Button
        type="button"
        variant="ghost"
        disabled={favoritePending}
        onClick={onFavoriteClick}
        aria-pressed={favoriteActive}
        className={cn(
          "h-10 rounded-full px-3 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          favoriteActive && "text-amber-500 hover:text-amber-500",
        )}
      >
        <Star className={cn("h-[18px] w-[18px]", favoriteActive && "fill-current")} />
        <span className="min-w-8 text-xs font-medium tabular-nums">
          {compactNumberFormatter.format(favoriteCount)}
        </span>
      </Button>

      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={savePending}
        onClick={onSaveClick}
        aria-pressed={saveActive}
        className={cn(
          "h-10 w-10 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          saveActive && "text-foreground",
        )}
      >
        <Bookmark className={cn("h-[18px] w-[18px]", saveActive && "fill-current")} />
      </Button>
    </div>
  );
}
