import React from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number; // The product rating (e.g. 4.5)
  maxRating?: number; // The maximum rating (optional, defaults to 5)
};

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {/* Render full stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star key={i} className="text-yellow-500 w-6 h-8 fill-current" />
        ))}

      {/* Render half star if present */}
      {halfStar && (
        <Star className="text-yellow-500 w-6 h-8 fill-current opacity-50" />
      )}

      {/* Render empty stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <Star key={i} className="text-gray-300 w-6 h-8 fill-none" />
        ))}
    </div>
  );
};

export default StarRating;
