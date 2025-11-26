import React from "react";
import { PlusCircle, Star } from "lucide-react";

export default function CategoryBar({
  categories,
  activeCategory,
  setActiveCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  seasonFilter,
  setSeasonFilter,
  onAddCategory,
  onRequestDeleteCategory,
}) {
  const seasons = ["All", "Spring", "Summer", "Autumn", "Winter", "All Year"];

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.name);
  };

  return (
    <div className="px-4 py-4">
      {/* categories row */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name;

          return (
            <button
              key={`${cat.id || cat.name}-pill`}
              onClick={() => handleCategoryClick(cat)}
              onContextMenu={(e) => {
                e.preventDefault();
                if (cat.isCustom && onRequestDeleteCategory) {
                  onRequestDeleteCategory(cat);
                }
              }}
              className={`category-pill whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                isActive ? "text-white active-category-glow" : "text-gray-700"
              }`}
              style={{
                backgroundColor: isActive
                  ? cat.color || "#618B4A"
                  : cat.color || "#E5E7EB",
              }}
            >
              {cat.iconType === "emoji" && (
                <span className="text-lg">{cat.icon}</span>
              )}
              {cat.iconType === "lucide" && <span>{cat.icon}</span>}
              {!cat.iconType && cat.icon && <span>{cat.icon}</span>}
              {cat.name}
            </button>
          );
        })}

        {/* Add category */}
        <button
          type="button"
          onClick={onAddCategory}
          className="category-pill whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 bg-gray-200 hover:bg-gray-300"
        >
          <PlusCircle size={16} />
          Add
        </button>
      </div>

      {/* favorites + season filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
          className={`category-pill favorites-pill px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
            showFavoritesOnly ? "active-category-glow text-white" : ""
          }`}
        >
          <Star size={16} />
          Favourites
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="uppercase tracking-[0.14em] text-gray-500">
            Season:
          </span>
          <div className="flex gap-2 flex-wrap">
            {seasons.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeasonFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  seasonFilter === s
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
