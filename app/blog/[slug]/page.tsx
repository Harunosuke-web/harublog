import { getPostBySlug, getAllPosts } from "@/lib/posts";
import BlogPostClient from "./BlogPostClient";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 relative">
      <article className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link
                href="/"
                className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/blog"
                className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
              >
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-700 dark:text-gray-300">{post.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-x-4 text-xs mb-6">
            <time
              dateTime={post.date}
              className="text-gray-500 dark:text-gray-400"
            >
              {new Date(post.date).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <Link
              href={`/blog/category/${encodeURIComponent(post.category)}`}
              className="rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              {post.category}
            </Link>
            <div className="flex gap-2">
              {post.tags.map((tag, index) => (
                <Link
                  key={`${post.slug}-detail-tag-${index}-${tag}`}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-x-4 text-sm">
            <div className="flex items-center gap-x-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {post.author}
              </span>
            </div>
          </div>

          {post.excerpt && (
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Client-side content */}
        <BlogPostClient post={post} />

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer"
          >
            ← ブログ一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
