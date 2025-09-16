'use client';

import { useRouter } from 'next/navigation';

interface CategoryButtonProps {
  category: string;
  categorySlug: string;
  variant?: 'overlay' | 'tight' | 'inline';
  className?: string;
  onClick?: (e: React.MouseEvent) => void; // カスタムクリックハンドラー
}

export default function CategoryButton({
  category,
  categorySlug,
  variant = 'inline',
  className = '',
  onClick
}: CategoryButtonProps) {
  const router = useRouter();

  const baseStyles = "text-xs font-medium transition-colors cursor-pointer";

  const variantStyles = {
    overlay: "absolute top-1 left-1 px-1.5 py-0.5 bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400 backdrop-blur-sm",
    tight: "hover:text-blue-600 dark:hover:text-blue-400",
    inline: "px-1.5 py-0.5 bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400 rounded"
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      router.push(`/blog/category/${categorySlug}`);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {category}
    </span>
  );
}