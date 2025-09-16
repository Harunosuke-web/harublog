'use client';

import { useRouter } from 'next/navigation';
import { getCategoryDisplayName } from '@/lib/slugs';

interface CategoryButtonProps {
  category: string;
  categorySlug: string;
  variant?: 'overlay' | 'tight' | 'inline';
  className?: string;
  showIcon?: boolean;
  onClick?: (e: React.MouseEvent) => void; // カスタムクリックハンドラー
}

export default function CategoryButton({
  category,
  categorySlug,
  variant = 'inline',
  className = '',
  showIcon = true,
  onClick
}: CategoryButtonProps) {
  const router = useRouter();

  const baseStyles = "text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1";

  const variantStyles = {
    overlay: "absolute top-1 left-1 px-2 py-1 bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400 backdrop-blur-sm",
    tight: "hover:text-blue-600 dark:hover:text-blue-400",
    inline: "px-2 py-1 bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400"
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      router.push(`/blog/category/${categorySlug}`);
    }
  };

  // カテゴリアイコン
  const CategoryIcon = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
    </svg>
  );

  return (
    <span
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {showIcon && <CategoryIcon />}
      {getCategoryDisplayName(categorySlug)}
    </span>
  );
}