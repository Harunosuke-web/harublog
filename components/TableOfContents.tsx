'use client';

import { useEffect, useState, useCallback } from 'react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headingsElements, setHeadingsElements] = useState<HTMLElement[]>([]);

  const updateActiveId = useCallback(() => {
    if (headingsElements.length === 0) return;

    let activeHeading = '';

    for (let i = headingsElements.length - 1; i >= 0; i--) {
      const element = headingsElements[i];
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150) {
          activeHeading = element.id;
          break;
        }
      }
    }

    if (activeHeading !== activeId) {
      setActiveId(activeHeading);
    }
  }, [headingsElements, activeId]);

  useEffect(() => {
    // Get all heading elements
    const elements = items
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    setHeadingsElements(elements);
  }, [items]);

  useEffect(() => {
    if (headingsElements.length === 0) return;

    // Set initial active heading
    updateActiveId();

    // Add throttled scroll listener
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateActiveId, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [headingsElements, updateActiveId]);

  if (items.length === 0) return null;

  return (
    <div className="hidden xl:block fixed top-32 right-4 w-56 z-10 max-w-[calc(50vw-400px)]">
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          目次
        </h3>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const paddingLeft = Math.max((item.level - 2) * 16, 0);

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-xs leading-5 transition-all duration-200 py-1 px-2 rounded-md border-l-2 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 border-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                }`}
                style={{ paddingLeft: paddingLeft + 8 }}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    const yOffset = -120;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    setActiveId(item.id);
                  }
                }}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}