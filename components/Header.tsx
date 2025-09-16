"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    if (!mounted) return;
    setTheme(newTheme);
    setThemeDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.theme-dropdown')) {
        setThemeDropdownOpen(false);
      }
    };

    if (themeDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [themeDropdownOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-700 shadow-sm text-gray-900 dark:text-gray-100 relative">
      <nav className="w-full px-6 lg:px-8" aria-label="Global">
        <div className="flex h-14 items-center justify-between 2xl:mx-auto 2xl:max-w-6xl">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 cursor-pointer">
              <span className="text-xl font-poppins font-medium text-gray-800 dark:text-gray-100 tracking-wide">
                harunosuke web
              </span>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">メニューを開く</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
            <Link
              href="/blog"
              className="text-sm font-normal leading-6 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm font-normal leading-6 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              About
            </Link>

            {/* Theme dropdown within navigation */}
            <div className="relative theme-dropdown ml-4">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600 rounded-md transition-colors cursor-pointer"
            disabled={!mounted}
          >
            {!mounted ? (
              <div className="w-12 h-4 bg-gray-300 rounded animate-pulse" />
            ) : (
              <>
                <span className="capitalize">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${themeDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {/* Dropdown menu */}
          {themeDropdownOpen && mounted && (
            <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
              <button
                onClick={() => handleThemeChange('light')}
                className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  theme === 'light' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  theme === 'dark' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                Dark
              </button>
            </div>
          )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-2 pb-3 pt-2">
              <Link
                href="/blog"
                className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
