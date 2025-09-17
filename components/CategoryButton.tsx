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
  isActive?: boolean;
  currentCategory?: string; // カテゴリページでハイライト表示用
}

export default function CategoryButton({
  category,
  categorySlug,
  variant = 'inline',
  className = '',
  showIcon = true,
  onClick,
  isActive = false,
  currentCategory
}: CategoryButtonProps) {
  const router = useRouter();

  const baseStyles = "text-xs font-medium transition-colors inline-flex items-center gap-1";

  // currentCategoryが提供されている場合は、それを使用して大文字小文字を無視した比較を行う
  const isCategoryActive = currentCategory
    ? currentCategory.toLowerCase() === category.toLowerCase()
    : isActive;

  const variantStyles = {
    overlay: "absolute top-1 left-1 px-2 py-1 bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400 backdrop-blur-sm cursor-pointer",
    tight: isCategoryActive
      ? "text-green-500 dark:text-green-400"
      : "hover:text-blue-600 dark:hover:text-blue-400",
    inline: `px-1.5 py-0.5 cursor-pointer ${
      isCategoryActive
        ? 'bg-black/90 text-green-500 dark:text-green-400'
        : 'bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400'
    }`
  };

  const handleClick = (e: React.MouseEvent) => {
    // カテゴリページでアクティブ状態の場合のみクリックを無効化
    // 記事詳細ページなど他のページではアクティブでもクリック可能
    if (isCategoryActive && currentCategory && window.location.pathname.includes('/blog/category/')) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(e);
    } else {
      router.push(`/blog/category/${categorySlug}`);
    }
  };

  // カテゴリアイコン（フォルダアイコン）
  const CategoryIcon = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
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