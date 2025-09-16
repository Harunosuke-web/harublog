'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types';
import { getCategorySlug, getTagSlug } from '@/lib/slugs';
import CategoryButton from '@/components/CategoryButton';

interface PostCardProps {
  post: Post;
  variant?: 'grid' | 'list' | 'tight';
  currentTag?: string; // タグページでハイライト表示用
  showAllTags?: boolean; // タグを全て表示するか制限するか
}

export default function PostCard({
  post,
  variant = 'list',
  currentTag,
  showAllTags = false
}: PostCardProps) {
  const router = useRouter();

  if (variant === 'tight') {
    return (
      <article
        className="group relative py-3 px-4 mx-0 border border-transparent border-b-gray-200 dark:border-b-gray-800 last:border-b-transparent hover:bg-white/80 hover:shadow-sm hover:border-white hover:rounded-lg dark:hover:bg-gray-800/30 dark:hover:border-gray-700 transition-colors duration-150 cursor-pointer"
        onClick={() => router.push(`/blog/${post.slug}`)}
      >
        <div>
          {/* Title */}
          <div className="mb-1">
            <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">
              {post.title}
            </h3>
          </div>

          {/* Meta info - Right aligned below title */}
          <div className="flex items-center justify-end gap-4 text-xs text-gray-500 dark:text-gray-400">
            <CategoryButton
              category={post.category}
              categorySlug={post.categorySlug}
              variant="tight"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/blog/category/${post.categorySlug}`);
              }}
              className="relative z-10"
            />
            <time
              dateTime={post.date}
              className="tabular-nums"
            >
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'grid') {
    return (
      <article className="group relative flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200">
        {/* Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-lg">
          <Image
            src={post.image || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=400&fit=crop&crop=smart'}
            alt={post.title}
            fill
            className="object-cover"
          />
          {/* Category overlay on image */}
          <CategoryButton
            category={post.category}
            categorySlug={post.categorySlug}
            variant="overlay"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          {/* Meta info */}
          <div className="flex items-center gap-x-3 mb-3">
            <time
              dateTime={post.date}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {new Date(post.date).toLocaleDateString('ja-JP')}
            </time>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>

          {/* Bottom section */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            {/* Author info - commented out for single author blog */}
            {/* <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {post.author}
              </span>
            </div> */}
            <div className="flex gap-1 ml-auto">
              {(showAllTags ? post.tags : post.tags.slice(0, 2)).map((tag, index) => (
                <span
                  key={`${post.slug}-tag-${index}-${tag}`}
                  onClick={() => router.push(`/blog/tag/${post.tagSlugs?.[index] || getTagSlug(tag)}`)}
                  className={`text-xs px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    currentTag === tag
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // List variant
  return (
    <article
      className="group p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
      onClick={() => router.push(`/blog/${post.slug}`)}
    >
      {/* Top row - Image, Title, Excerpt with equal heights */}
      <div className="flex gap-4 mb-3">
        {/* Image */}
        <div className="w-48 flex-shrink-0">
          <div className="relative w-48 aspect-[4/3] overflow-hidden">
            <Image
              src={post.image || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=400&fit=crop&crop=smart'}
              alt={post.title}
              fill
              className="object-cover"
            />
            {/* Category overlay on image */}
            <CategoryButton
              category={post.category}
              categorySlug={post.categorySlug}
              variant="overlay"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/blog/category/${post.categorySlug}`);
              }}
              className="relative z-10"
            />
          </div>
        </div>

        {/* Content area with height matching image (4:3 aspect ratio) */}
        <div className="flex-1 min-w-0 flex flex-col h-[144px]">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {post.title}
          </h2>

          {/* Excerpt - constrained to remaining height */}
          <div className="relative flex-1 overflow-hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {post.excerpt.length > 150 ? `${post.excerpt.slice(0, 150)}......` : post.excerpt}
            </p>
          </div>

          {/* Underline with right-fade gradient - positioned within content area */}
          <div className="h-0.5 bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent group-hover:from-gray-400 dark:group-hover:from-gray-500 transition-colors duration-200 mt-3"></div>
        </div>
      </div>

      {/* Bottom row - Date and Tags */}
      <div className="flex items-center justify-between">
        <time
          dateTime={post.date}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          {new Date(post.date).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>

        <div className="flex flex-wrap gap-1">
          {(showAllTags ? post.tags : post.tags.slice(0, 3)).map((tag, index) => (
            <span
              key={`${post.slug}-bottom-tag-${index}-${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/blog/tag/${post.tagSlugs?.[index] || getTagSlug(tag)}`);
              }}
              className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium transition-colors cursor-pointer relative z-10 ${
                currentTag === tag
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-black/90 text-gray-300 hover:bg-black/80 hover:text-blue-400'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}