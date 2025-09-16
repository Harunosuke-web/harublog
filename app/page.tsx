import { getAllPosts } from '@/lib/posts';
import HomeClient from './HomeClient';

export default function Home() {
  const posts = getAllPosts();
  const featuredPosts = posts.slice(0, 6); // 6記事取得して選択の余地を残す

  // オプション例：
  // 1. 最大4記事表示（デフォルト）
  // 2. 特定の記事を指定する場合
  // const specificPosts = ['sample-post', 'next-js-tutorial']; // slugを指定

  return (
    <HomeClient
      featuredPosts={featuredPosts}
      maxPosts={4} // ギャラリービューで2x2表示
      // featuredPostSlugs={specificPosts} // 特定記事を指定したい場合
    />
  );
}
