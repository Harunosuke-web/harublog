import { getPostBySlug, getAllPosts } from "@/lib/posts";
import BlogPostClient from "./BlogPostClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryButton from "@/components/CategoryButton";
import TagButton from "@/components/TagButton";
import Breadcrumb from "@/components/Breadcrumb";
import DateFormatter from "@/components/DateFormatter";
import { getCategorySlug, getTagSlug } from "@/lib/slugs";

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
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <main>
        <article className="mx-auto max-w-4xl">
          {/* Floating Breadcrumb Navigation - above title */}
          <nav aria-label="Breadcrumb" className="-mt-12 mb-2">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.category, href: `/blog/category/${getCategorySlug(post.category)}` }
              ]}
            />
          </nav>
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl mb-6">
              {post.title}
            </h1>

            {/* Meta information - タイトル下に配置 */}
            <aside className="mb-8">
              <div className="flex items-center gap-x-4 text-xs">
                <DateFormatter
                  dateString={post.date}
                  className="text-gray-500 dark:text-gray-400"
                />
                <CategoryButton
                  category={post.category}
                  categorySlug={getCategorySlug(post.category)}
                  variant="inline"
                  showIcon={true}
                  currentCategory={post.category}
                />
                <div className="flex gap-2">
                  {post.tags.map((tag, index) => (
                    <TagButton
                      key={`${post.slug}-detail-tag-${index}-${tag}`}
                      tag={tag}
                      tagSlug={getTagSlug(tag)}
                      variant="default"
                    />
                  ))}
                </div>
              </div>
            </aside>

          {/* Author display - commented out for single author blog */}
          {/*
          <div className="flex items-center gap-x-4 text-sm">
            <div className="flex items-center gap-x-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {post.author}
              </span>
            </div>
          </div>
          */}

          {post.excerpt && (
            <p className="mt-6 text-sm leading-6 text-gray-500 dark:text-gray-400">
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
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
