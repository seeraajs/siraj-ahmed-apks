import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeHeartProps {
  appId: string;
  likes: number;
  onToggleLike?: (newLikes: number, liked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function LikeHeart({
  appId,
  likes,
  onToggleLike,
  size = 'md',
}: LikeHeartProps) {
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`sat_like_${appId}`) === 'true';
    } catch {
      return false;
    }
  });
  const [currentLikes, setCurrentLikes] = useState<number>(likes);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLiked = !isLiked;
    const nextTotal = nextLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    setIsLiked(nextLiked);
    setCurrentLikes(nextTotal);

    try {
      if (nextLiked) {
        localStorage.setItem(`sat_like_${appId}`, 'true');
      } else {
        localStorage.removeItem(`sat_like_${appId}`);
      }
    } catch {}

    if (onToggleLike) {
      onToggleLike(nextTotal, nextLiked);
    }
  };

  const buttonSizes = {
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-2.5 py-1.5 text-xs gap-1.5',
    lg: 'px-3 py-2 text-sm gap-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  };

  return (
    <button
      type="button"
      id={`like-btn-${appId}`}
      onClick={handleToggle}
      className={`inline-flex items-center rounded-lg border font-medium transition-all select-none cursor-pointer ${buttonSizes[size]} ${
        isLiked
          ? 'bg-rose-950/60 border-rose-800 text-rose-400 shadow-xs'
          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
      }`}
      aria-label={`${isLiked ? 'Unlike' : 'Like'} application`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-200 ${
          isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'
        }`}
      />
      <span className="font-mono text-xs">{currentLikes}</span>
    </button>
  );
}
