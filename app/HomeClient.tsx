'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import DecorativeHeading from '@/components/DecorativeHeading';
import PageLayout from '@/components/PageLayout';
import ViewToggle, { ViewType } from '@/components/ViewToggle';
import PostDisplay from '@/components/PostDisplay';
import Button from '@/components/Button';

interface HomeClientProps {
  featuredPosts: Post[];
  maxPosts?: number;
  featuredPostSlugs?: string[];
}

export default function HomeClient({ featuredPosts, maxPosts = 4, featuredPostSlugs }: HomeClientProps) {
  const [view, setView] = useState<ViewType>('list');

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <main>
        {/* Hero Section - narrow width */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Harunosuke web
            </h1>
            <p className="mt-8 text-lg font-light leading-8 text-gray-600 dark:text-gray-300 px-4">
              技術とクリエイティブを探求する個人ブログ。AI、Development、数学について書いています。
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Button href="/blog" className="w-44">
                ブログを読む
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
              <Button href="/about" className="w-44">
                About
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Posts - medium width */}
        {featuredPosts.length > 0 && (
          <section className="py-24 sm:py-32">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8">
                <DecorativeHeading>
                  最新の記事
                </DecorativeHeading>
                <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  新しく投稿された記事をチェックしてみてください。
                </p>
              </div>
            </div>

            {/* View Toggle above posts - same width as PostDisplay */}
            <div className="mx-auto max-w-4xl">
              <div className="flex justify-end mb-10">
                <ViewToggle
                  currentView={view}
                  availableViews={['list', 'grid']}
                  onViewChange={setView}
                />
              </div>
            </div>

            <PostDisplay
              posts={featuredPosts}
              view={view}
              maxPosts={maxPosts}
              featuredPostSlugs={featuredPostSlugs}
              showReadMore={true}
            />
          </section>
        )}

        {/* About Section - medium width */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <DecorativeHeading>
              About
            </DecorativeHeading>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              こんにちは、ハルノスケです。技術とクリエイティブを探求することに情熱を注いでいます。
              このブログでは、AIを使った技術、プログラミング、数学に関する知識や体験を共有しています。
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              読者の皆さんと一緒に学び成長していけるようなコンテンツを心がけています。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
