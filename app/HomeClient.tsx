'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import DecorativeHeading from '@/components/DecorativeHeading';
import PageLayout from '@/components/PageLayout';
import ViewToggle, { ViewType } from '@/components/ViewToggle';
import PostDisplay from '@/components/PostDisplay';

interface HomeClientProps {
  featuredPosts: Post[];
  maxPosts?: number;
  featuredPostSlugs?: string[];
}

export default function HomeClient({ featuredPosts, maxPosts = 4, featuredPostSlugs }: HomeClientProps) {
  const [view, setView] = useState<ViewType>('list');

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
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
            <Link
              href="/blog"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-normal text-white shadow-sm hover:bg-blue-500 transition-all duration-200 hover:shadow-md"
            >
              ブログを読む
            </Link>
            <Link
              href="/about"
              className="text-sm font-normal leading-6 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              About <span aria-hidden="true">→</span>
            </Link>
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
            こんにちは、ハルノスケです。技術とクリエイティブの境界を探求することに情熱を注いでいます。
            このブログでは、プログラミング、数学、デザインに関する知識や体験を共有しています。
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            複雑な数式から美しいUIデザインまで、様々なトピックを扱い、
            読者の皆さんと一緒に学び成長していけるようなコンテンツを心がけています。
          </p>
        </div>
      </section>
    </div>
  );
}
