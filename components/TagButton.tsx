'use client';

import { useRouter } from 'next/navigation';

interface TagButtonProps {
  tag: string;
  tagSlug?: string;
  variant?: 'default' | 'inline';
  isActive?: boolean;
  currentTag?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function TagButton({
  tag,
  tagSlug,
  variant = 'default',
  isActive = false,
  currentTag,
  className = '',
  onClick
}: TagButtonProps) {
  const router = useRouter();

  const baseStyles = "text-xs font-medium transition-colors cursor-pointer relative z-10";

  // currentTagが提供されている場合は、それを使用して大文字小文字を無視した比較を行う
  const isTagActive = currentTag
    ? currentTag.toLowerCase() === tag.toLowerCase()
    : isActive;

  const variantStyles = {
    default: `px-1.5 py-0.5 ${
      isTagActive
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        : 'bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400'
    }`,
    inline: `inline-flex items-center px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 ${
      isTagActive
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    }`
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      e.stopPropagation();
      router.push(`/blog/tag/${tagSlug}`);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      #{tag}
    </span>
  );
}