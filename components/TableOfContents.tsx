'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import TocList from './TocList';

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
    const viewportCenter = windowHeight / 2;
    const upperThird = windowHeight / 3;

    let activeHeading = '';
    let bestDistance = Infinity;

    // Find the heading closest to the center of the viewport
    for (let i = 0; i < headingsElementsRef.current.length; i++) {
      const element = headingsElementsRef.current[i];
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        const elementCenter = elementTop + (rect.height / 2);

        // Only consider headings that are at least partially visible
        if (elementBottom > 0 && elementTop < windowHeight) {
          // Calculate distance from viewport center
          const distanceFromCenter = Math.abs(elementCenter - viewportCenter);

          // Prefer headings in the upper third for better reading experience
          const adjustedDistance = elementTop < upperThird ? distanceFromCenter * 0.7 : distanceFromCenter;

          if (adjustedDistance < bestDistance) {
            bestDistance = adjustedDistance;
            activeHeading = element.id;
          }
        }
      }
    }

    // If no heading is visible in viewport, find the closest one above
    if (!activeHeading) {
      for (let i = headingsElementsRef.current.length - 1; i >= 0; i--) {
        const element = headingsElementsRef.current[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;

          // Find the last heading that has passed above the viewport
          if (elementTop < 0) {
            activeHeading = element.id;
            break;
          }
        }
      }
    }

    // Special case: if at very top of page, use first heading
    if (!activeHeading && scrollY < 100 && headingsElementsRef.current.length > 0) {
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

    // Get all heading elements in document order (excluding h1)
    const elements = items
      .filter(item => item.level >= 2) // Only h2 and below
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

  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (itemId: string) => {
    const element = document.getElementById(itemId);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(itemId);
      setIsOpen(false); // Close popup if open
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop TOC - floating sidebar (large screens only) */}
      <div className="hidden 2xl:block fixed top-32 z-10" style={{
        left: 'calc(50% + 28rem + 2rem)', // Position relative to content area (max-w-4xl = 56rem, so half is 28rem)
        width: '320px' // Fixed width for consistent display
      }}>
      <div className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-5 max-h-[calc(100vh-200px)] overflow-y-auto backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        {/* H1 items at the top - no active highlighting */}
        {items.filter(item => item.level === 1).map((item) => {
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block text-base font-bold leading-6 transition-colors duration-150 py-2 px-4 mb-3 rounded-md cursor-pointer text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item.id);
              }}
            >
              {item.title}
            </a>
          );
        })}

        {/* Contents header */}
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          Contents
        </h3>

        {/* H2 and below items using TocList */}
        <TocList
          items={items}
          activeId={activeId}
          onItemClick={handleItemClick}
          variant="desktop"
        />
      </div>
      </div>

      {/* Mobile/Tablet TOC - floating button and popup */}
      <div className="block 2xl:hidden">
        {/* Floating TOC Button */}
        <div className="fixed bottom-6 right-6 z-50 group">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-12 h-12 bg-gray-100/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center border border-gray-200/60 dark:border-gray-600/60 hover:scale-105 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur-sm ${
              isOpen ? 'bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300' : ''
            }`}
            aria-label="目次を開く"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="4" cy="6" r="2"/>
              <circle cx="4" cy="12" r="2"/>
              <circle cx="4" cy="18" r="2"/>
              <path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Custom tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              目次を表示
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          </div>
        </div>

        {/* TOC Popup */}
        {isOpen && (
          <>
            {/* Invisible backdrop for closing */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Popup Content */}
            <div className="fixed bottom-16 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] shadow-2xl border border-blue-200 dark:border-blue-700 rounded-xl max-h-[calc(100vh-5rem)] overflow-hidden bg-blue-50 dark:bg-blue-950/90">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  目次
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                <TocList
                  items={items}
                  activeId={activeId}
                  onItemClick={handleItemClick}
                  variant="popup"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}