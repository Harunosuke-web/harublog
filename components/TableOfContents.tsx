'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';

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
  const headingsElementsRef = useRef<HTMLElement[]>([]);
  const itemsStringRef = useRef<string>('');

  // Memoize items to prevent unnecessary re-renders
  const itemsString = useMemo(() => JSON.stringify(items), [items]);

  const updateActiveId = useCallback(() => {
    if (headingsElementsRef.current.length === 0) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const threshold = 100; // Reduced threshold for more responsive highlighting

    let activeHeading = '';
    let bestScore = -1;

    // Calculate which heading is most prominently visible
    for (let i = 0; i < headingsElementsRef.current.length; i++) {
      const element = headingsElementsRef.current[i];
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom;

        // Score based on visibility and position
        let score = 0;

        if (elementTop <= threshold) {
          // Element is above or at threshold
          if (elementBottom > 0) {
            // Element is visible, score based on how close it is to threshold
            score = 1000 - Math.abs(elementTop - threshold);
          } else {
            // Element is above viewport but was recently visible
            score = 500 - Math.abs(elementTop);
          }
        } else {
          // Element is below threshold, lower score
          score = 200 - elementTop;
        }

        if (score > bestScore) {
          bestScore = score;
          activeHeading = element.id;
        }
      }
    }

    // Fallback: if at very top of page, use first heading
    if (!activeHeading && scrollY < 50 && headingsElementsRef.current.length > 0) {
      activeHeading = headingsElementsRef.current[0].id;
    }

    if (activeHeading && activeHeading !== activeId) {
      setActiveId(activeHeading);
    }
  }, [activeId]);

  useEffect(() => {
    // Only update if items actually changed
    if (itemsString === itemsStringRef.current) return;

    itemsStringRef.current = itemsString;

    // Get all heading elements in document order
    const elements = items
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
      .sort((a, b) => {
        // Sort by position in document
        const position = a.compareDocumentPosition(b);
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });

    headingsElementsRef.current = elements;
  }, [items, itemsString]);

  useEffect(() => {
    if (headingsElementsRef.current.length === 0) return;

    // Set initial active heading
    updateActiveId();

    // Use requestAnimationFrame for smoother updates
    let rafId: number;
    let lastScrollTime = 0;

    const handleScroll = () => {
      const now = Date.now();

      // Throttle to ~16ms (60fps) for smooth performance
      if (now - lastScrollTime < 16) {
        return;
      }

      lastScrollTime = now;

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        updateActiveId();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [updateActiveId, itemsString]); // Use itemsString to detect items changes

  if (items.length === 0) return null;

  return (
    <div className="hidden xl:block fixed top-32 z-10" style={{
      left: 'calc(50% + 400px + 2rem)', // Position relative to content area (max-w-3xl = 768px, so half is 384px ≈ 400px)
      width: 'min(240px, calc(50vw - 400px - 4rem))' // Responsive width with minimum
    }}>
      <div className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-5 max-h-[calc(100vh-200px)] overflow-y-auto backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          目次
        </h3>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const paddingLeft = Math.max((item.level - 2) * 14, 0);

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm leading-6 transition-all duration-200 py-2 px-3 rounded-md cursor-pointer ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                style={{ paddingLeft: paddingLeft + 12 }}
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