interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TocListProps {
  items: TocItem[];
  activeId: string;
  onItemClick: (id: string) => void;
  variant?: 'desktop' | 'popup' | 'mobile';
  className?: string;
}

export default function TocList({
  items,
  activeId,
  onItemClick,
  variant = 'desktop',
  className = ''
}: TocListProps) {
  if (items.length === 0) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'desktop':
        return {
          container: 'space-y-0.5',
          item: 'block text-sm leading-5 transition-colors duration-150 py-1.5 px-4 rounded-md cursor-pointer',
          activeItem: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium',
          h1Item: 'text-gray-900 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800/50',
          h2Item: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-bold',
          otherItem: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        };
      case 'popup':
        return {
          container: 'space-y-1',
          item: 'block text-sm leading-5 transition-colors duration-150 py-2 px-3 rounded-md cursor-pointer',
          activeItem: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium',
          h1Item: 'text-gray-900 dark:text-gray-100 font-bold hover:bg-gray-100 dark:hover:bg-gray-700/50',
          h2Item: 'text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50',
          otherItem: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        };
      case 'mobile':
        return {
          container: 'space-y-1',
          item: 'block text-sm leading-5 transition-colors duration-150 py-2 px-3 rounded-md cursor-pointer',
          activeItem: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium',
          h1Item: 'text-gray-900 dark:text-gray-100 font-bold hover:bg-gray-100 dark:hover:bg-gray-700/50',
          h2Item: 'text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50',
          otherItem: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
        };
      default:
        return getVariantStyles();
    }
  };

  const styles = getVariantStyles();

  const handleItemClick = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    onItemClick(itemId);
  };

  const getItemStyles = (item: TocItem, isActive: boolean) => {
    if (isActive) return `${styles.item} ${styles.activeItem}`;

    switch (item.level) {
      case 1:
        return `${styles.item} ${styles.h1Item}`;
      case 2:
        return `${styles.item} ${styles.h2Item}`;
      default:
        return `${styles.item} ${styles.otherItem}`;
    }
  };

  const getPaddingLeft = (item: TocItem) => {
    if (variant === 'desktop') {
      return Math.max((item.level - 2) * 14, 0);
    }
    return Math.max((item.level - 1) * 16, 0);
  };

  // Filter items based on variant
  const filteredItems = variant === 'desktop'
    ? items.filter(item => item.level >= 2) // Only h2 and below for desktop
    : items; // All items for popup and mobile

  return (
    <nav className={`${styles.container} ${className}`}>
      {filteredItems.map((item) => {
        const isActive = activeId === item.id;
        const paddingLeft = getPaddingLeft(item);

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={getItemStyles(item, isActive)}
            style={{ paddingLeft: paddingLeft + (variant === 'desktop' ? 16 : 0) }}
            onClick={(e) => handleItemClick(e, item.id)}
          >
            {item.title}
          </a>
        );
      })}
    </nav>
  );
}