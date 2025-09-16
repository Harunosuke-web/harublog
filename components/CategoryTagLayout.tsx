import Link from 'next/link';
import { Post } from '@/lib/types';
import PostCard from '@/components/PostCard';
import Breadcrumb from '@/components/Breadcrumb';

interface CategoryTagLayoutProps {
  type: 'Category' | 'Tag';
  name: string;
  posts: Post[];
  currentTag?: string;
  showAllTags?: boolean;
}

export default function CategoryTagLayout({
  type,
  name,
  posts,
  currentTag,
  showAllTags = false
}: CategoryTagLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: name }
          ]}
        />

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
          {type === 'Category' ? 'Category' : 'tag'}: {name}
        </h1>
        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-16">
          {posts.length}件の記事があります
        </p>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              variant="list"
              currentTag={currentTag}
              showAllTags={showAllTags}
            />
          ))}
        </div>

        {/* Back to blog link */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer"
          >
            ← ブログ一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}