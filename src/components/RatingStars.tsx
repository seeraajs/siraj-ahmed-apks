import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  appId: string;
  average: number;
  count: number;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onRate?: (rating: number) => void;
}

export function RatingStars({
  appId,
  average,
  count,
  interactive = true,
  size = 'md',
  onRate,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(`sat_rate_${appId}`);
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  const handleRatingClick = (val: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;
    setUserRating(val);
    try {
      localStorage.setItem(`sat_rate_${appId}`, val.toString());
    } catch {}
    if (onRate) onRate(val);
  };

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const currentDisplay = hoverRating || userRating || Math.round(average);

  return (
    <div
      id={`rating-stars-${appId}`}
      className="inline-flex items-center gap-1.5 select-none"
      title={count > 0 ? `Rated ${average.toFixed(1)} / 5 by ${count} ratings` : 'No ratings yet'}
    >
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={(e) => handleRatingClick(star, e)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={`p-0.5 transition-transform ${
              interactive ? 'cursor-pointer hover:scale-120' : 'cursor-default'
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`${starSizes[size]} transition-colors duration-150 ${
                star <= currentDisplay
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
        {count > 0 ? (
          <>
            <span className="font-bold text-white">{average.toFixed(1)}</span>
            <span className="text-slate-400 text-[11px]">({count})</span>
          </>
        ) : (
          <span className="text-slate-500 text-[11px]">Unrated</span>
        )}
      </div>
    </div>
  );
}
