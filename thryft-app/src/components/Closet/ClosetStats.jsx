import React from "react";
import { Sparkles, Heart, BarChart3 } from "lucide-react";

export default function ClosetStats({ stats }) {
  if (!stats) return null;

  const { totalItems, favorites, wornThisMonth, mostUsedCategory, colorTags } =
    stats;

  return (
    <div className="px-4 mt-4 mb-2">
      <div className="editorial-card rounded-2xl p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <div>
            <div className="text-xs uppercase tracking-[0.12em] text-gray-500">
              Closet Snapshot
            </div>
            <div className="text-sm font-semibold">
              {totalItems || 0} items · {favorites || 0} favourites
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <BarChart3 size={14} />
            <span className="uppercase tracking-[0.12em] text-gray-500">
              Worn this month:
            </span>
            <span className="font-semibold">{wornThisMonth || 0}</span>
          </div>

          {mostUsedCategory && (
            <div className="flex items-center gap-1">
              <span className="uppercase tracking-[0.12em] text-gray-500">
                Most used:
              </span>
              <span className="font-semibold">{mostUsedCategory}</span>
            </div>
          )}

          {colorTags && colorTags.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="uppercase tracking-[0.12em] text-gray-500">
                Palette:
              </span>
              <div className="flex gap-1">
                {colorTags.slice(0, 5).map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-full bg-gray-100 text-[0.68rem] font-medium"
                  >
                    {c}
                  </span>
                ))}
                {colorTags.length > 5 && (
                  <span className="text-[0.7rem] text-gray-500">
                    +{colorTags.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
          <Heart size={14} className="text-red-400" />
          <span>Style, but make it organised.</span>
        </div>
      </div>
    </div>
  );
}
