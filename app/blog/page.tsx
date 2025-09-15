import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          ブログ記事一覧
        </h1>
        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
          技術、数学、デザインに関する記事を投稿しています。
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mx-auto max-w-2xl mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              記事がありません
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              まだ投稿された記事がありません。新しい記事をお楽しみに！
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <article className="group relative flex flex-col items-start overflow-hidden bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="relative w-full h-48 mb-4 overflow-hidden">
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
                <div className="flex gap-2">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={`${post.slug}-tag-${index}-${tag}`}
                      className="relative z-10 rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-700 dark:text-gray-300 font-normal">
                  {post.excerpt}
                </p>
              </div>
              <div className="relative mt-auto flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-medium text-gray-900 dark:text-white">
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
      )}
    </div>
  );
}