import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();
  const featuredPosts = posts.slice(0, 3);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            はるのすけのブログ
          </h1>
          <p className="mt-8 text-lg font-light leading-8 text-gray-600 dark:text-gray-300 px-4">
            技術とクリエイティブを探求する個人ブログ。プログラミング、数学、デザインについて書いています。
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

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              最新の記事
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              新しく投稿された記事をチェックしてみてください。
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 dark:border-gray-800 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <article
                  className="group relative flex max-w-xl flex-col items-start justify-between overflow-hidden bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.image || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=400&fit=crop&crop=smart'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-6 pb-6 flex flex-col flex-1">
                <div className="flex items-center gap-x-4 text-xs">
                  <time
                    dateTime={post.date}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    {new Date(post.date).toLocaleDateString('ja-JP')}
                  </time>
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={`${post.slug}-tag-${index}-${tag}`}
                      className="relative z-10 rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-700 dark:text-gray-300 font-normal">
                    {post.excerpt}
                  </p>
                </div>
                <div className="relative mt-auto flex items-center gap-x-4">
                  <div className="text-sm leading-6">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {post.author}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-normal">
                      {post.readTime}分で読める
                    </p>
                  </div>
                </div>
                </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            About
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            こんにちは、はるのすけです。技術とクリエイティブの境界を探求することに情熱を注いでいます。
            このブログでは、プログラミング、数学、デザインに関する知識や体験を共有しています。
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            複雑な数式から美しいUIデザインまで、様々なトピックを扱い、
            読者の皆さんと一緒に学び成長していけるようなコンテンツを心がけています。
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}
