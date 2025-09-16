import Link from 'next/link';
import { Post } from '@/lib/types';
import PostCard from '@/components/PostCard';
import { ViewType } from '@/components/ViewToggle';
import Button from '@/components/Button';

interface PostDisplayProps {
  posts: Post[];
  view: ViewType;
  maxPosts?: number;
  featuredPostSlugs?: string[];
  currentTag?: string;
  showAllTags?: boolean;
  showReadMore?: boolean;
}

export default function PostDisplay({
  posts,
  view,
  maxPosts,
  featuredPostSlugs,
  currentTag,
  showAllTags = false,
  showReadMore = false
}: PostDisplayProps) {
  // 表示する記事を決定
  let displayPosts = posts;

  // 特定の記事を指定されている場合
  if (featuredPostSlugs && featuredPostSlugs.length > 0) {
    displayPosts = featuredPostSlugs
      .map(slug => posts.find(post => post.slug === slug))
      .filter((post): post is Post => post !== undefined);
  }

  // 最大表示数を適用
  if (maxPosts && maxPosts > 0) {
    displayPosts = displayPosts.slice(0, maxPosts);
  }

  // Read Moreボタンコンポーネント
  const ReadMoreButton = () => {
    if (!showReadMore) return null;

    return (
      <div className="mt-12 text-center">
        <Button href="/blog">
          Read More
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Button>
      </div>
    );
  };

  // ビューに応じてレイアウトを決定
  switch (view) {
    case 'tight':
      return (
        <div className="mx-auto mt-2 max-w-4xl">
          {displayPosts.map((post) => (
            <PostCard key={post.slug} post={post} variant="tight" />
          ))}
          <ReadMoreButton />
        </div>
      );

    case 'list':
      return (
        <div className="mx-auto mt-2 max-w-4xl space-y-4">
          {displayPosts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              variant="list"
              currentTag={currentTag}
              showAllTags={showAllTags}
            />
          ))}
          <ReadMoreButton />
        </div>
      );

    case 'grid':
      return (
        <div className="mx-auto mt-2 max-w-4xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {displayPosts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                variant="grid"
                currentTag={currentTag}
                showAllTags={showAllTags}
              />
            ))}
          </div>
          <ReadMoreButton />
        </div>
      );

    default:
      return null;
  }
}
