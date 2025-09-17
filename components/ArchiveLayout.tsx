import Link from 'next/link';
import { Post } from '@/lib/types';
import PostCard from '@/components/PostCard';
import Breadcrumb from '@/components/Breadcrumb';

interface ArchiveLayoutProps {
  title: string;
  description: string;
  posts: Post[];
  breadcrumbItems: Array<{ label: string; href?: string }>;
  backLinkHref?: string;
  backLinkText?: string;
}

export default function ArchiveLayout({
  title,
  description,
  posts,
  breadcrumbItems,
  backLinkHref = '/blog',
  backLinkText = 'ブログ一覧に戻る'
}: ArchiveLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <main>
        <div className="mx-auto max-w-4xl">
          {/* Floating Breadcrumb Navigation - above title */}
          <nav aria-label="Breadcrumb" className="-mt-12 mb-2">
            <Breadcrumb items={breadcrumbItems} />
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
            {title}
          </h1>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-16">
            {description}
          </p>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                variant="list"
              />
            ))}
          </div>

          {/* Back to blog link */}
          <div className="mt-16 text-center">
            <Link
              href={backLinkHref}
              className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer"
            >
              ← {backLinkText}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}