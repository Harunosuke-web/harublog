'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types';
import { getCategorySlug, getTagSlug } from '@/lib/slugs';
import CategoryButton from '@/components/CategoryButton';
import TagButton from '@/components/TagButton';
import DateFormatter from '@/components/DateFormatter';

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
              categorySlug={getCategorySlug(post.category)}
              variant="tight"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/blog/category/${getCategorySlug(post.category)}`);
              }}
              className="relative z-10"
            />
            <DateFormatter
              dateString={post.date}
              className="tabular-nums"
            />
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'grid') {
    return (
      <article
        className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
        onClick={() => router.push(`/blog/${post.slug}`)}
      >
        {/* Image Block */}
        <div className="mb-4">
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={post.image || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=400&fit=crop&crop=smart'}
              alt={post.title}
              fill
              className="object-cover"
            />
            {/* Category overlay on image */}
            <CategoryButton
              category={post.category}
              categorySlug={getCategorySlug(post.category)}
              variant="overlay"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/blog/category/${getCategorySlug(post.category)}`);
              }}
              className="relative z-10"
            />
          </div>
        </div>

        {/* Meta and Tags Block */}
        <div className="flex items-center justify-between mb-4">
          <DateFormatter
            dateString={post.date}
            className="text-xs text-gray-500 dark:text-gray-400"
          />

          <div className="flex gap-1">
            {(showAllTags ? post.tags : post.tags.slice(0, 2)).map((tag, index) => (
              <TagButton
                key={`${post.slug}-tag-${index}-${tag}`}
                tag={tag}
                tagSlug={getTagSlug(tag)}
                variant="default"
                currentTag={currentTag}
              />
            ))}
          </div>
        </div>

        {/* Content Block */}
        <div className="flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </article>
    );
  }

  // List variant
  return (
    <article
      className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
      onClick={() => router.push(`/blog/${post.slug}`)}
    >
      {/* Top row - Image, Title, Excerpt with equal heights */}
      <div className="flex gap-3 mb-2">
        {/* Image - smaller size */}
        <div className="w-36 flex-shrink-0">
          <div className="relative w-36 aspect-[4/3] overflow-hidden">
            <Image
              src={post.image || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=400&fit=crop&crop=smart'}
              alt={post.title}
              fill
              className="object-cover"
            />
            {/* Category overlay on image */}
            <CategoryButton
              category={post.category}
              categorySlug={getCategorySlug(post.category)}
              variant="overlay"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/blog/category/${getCategorySlug(post.category)}`);
              }}
              className="relative z-10"
            />
          </div>
        </div>

        {/* Content area with height matching image */}
        <div className="flex-1 min-w-0 flex flex-col h-[108px]">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {post.title}
          </h2>

          {/* Excerpt - constrained to remaining height */}
          <div className="relative flex-1 overflow-hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {post.excerpt.length > 120 ? `${post.excerpt.slice(0, 120)}......` : post.excerpt}
            </p>
          </div>

          {/* Underline with right-fade gradient - positioned within content area */}
          <div className="h-0.5 bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent group-hover:from-gray-400 dark:group-hover:from-gray-500 transition-colors duration-200 mt-2"></div>
        </div>
      </div>

      {/* Bottom row - Date and Tags */}
      <div className="flex items-center justify-between">
        <DateFormatter
          dateString={post.date}
          className="text-xs text-gray-500 dark:text-gray-400"
        />

        <div className="flex flex-wrap gap-1">
          {(showAllTags ? post.tags : post.tags.slice(0, 3)).map((tag, index) => (
            <TagButton
              key={`${post.slug}-bottom-tag-${index}-${tag}`}
              tag={tag}
              tagSlug={getTagSlug(tag)}
              variant="default"
              currentTag={currentTag}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
