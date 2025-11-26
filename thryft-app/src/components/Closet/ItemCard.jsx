import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";

export default function ItemCard({
  item,
  onImageClick,
  onDelete,
  onToggleFavorite,
  onMarkWorn,
}) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="closet-item-card editorial-card polaroid relative"
    >
      {/* simple flip container */}
      <div
        className={`flip-card-inner ${flipped ? "is-flipped" : ""}`}
        onClick={handleFlip}
      >
        {/* FRONT */}
        <div className="flip-card-front">
          <img
            src={item.image}
            onClick={(e) => {
              e.stopPropagation();
              if (onImageClick) onImageClick();
            }}
            className="cursor-pointer w-full h-[150px] object-cover rounded-lg transition-transform duration-300 md:hover:scale-110"
          />

          <div className="flex justify-between items-center mt-2">
            <div className="polaroid-label">{item.name}</div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-thryftGreen text-white px-2 py-1 rounded-full">
                {item.category}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleFavorite) onToggleFavorite();
                }}
                className={`favorite-btn ${
                  item.favorite ? "is-favorite" : ""
                }`}
                aria-label={
                  item.favorite
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
              >
                <Star
                  size={16}
                  className="favorite-icon"
                  fill={item.favorite ? "#facc15" : "none"}
                />
              </button>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-card-back">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-1">
                Wear Stats
              </div>
              <div className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Clock size={14} />
                <span>
                  Worn {item.timesWorn || 0}{" "}
                  {item.timesWorn === 1 ? "time" : "times"}
                </span>
              </div>

              {item.lastWorn && (
                <div className="text-[0.7rem] text-gray-600 mb-2">
                  Last worn:{" "}
                  {item.lastWorn.toDate
                    ? item.lastWorn.toDate().toLocaleDateString()
                    : ""}
                </div>
              )}

              <div className="text-[0.7rem] text-gray-600 mb-1">
                Colour: <span className="font-medium">{item.colorTag}</span>
              </div>
              <div className="text-[0.7rem] text-gray-600">
                Season: <span className="font-medium">{item.seasonTag}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                className="w-full text-xs bg-thryftGreen text-white py-1.5 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMarkWorn) onMarkWorn();
                }}
              >
                Mark Worn Today
              </button>

              <button
                type="button"
                className="w-full text-xs text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete();
                }}
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
