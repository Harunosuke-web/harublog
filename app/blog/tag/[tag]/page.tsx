import { getPostsByTagSlug, getAllTagSlugs } from '@/lib/posts';
import { getTagDisplayName } from '@/lib/slugs';
import { notFound } from 'next/navigation';
import CategoryTagLayout from '@/components/CategoryTagLayout';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const tagSlug = decodeURIComponent(tag);
  const posts = getPostsByTagSlug(tagSlug);

  if (posts.length === 0) {
    notFound();
  }

  // URLスラッグから表示名を生成
  const tagName = getTagDisplayName(tagSlug);

  return (
    <CategoryTagLayout
      type="Tag"
      name={tagName}
      posts={posts}
      currentTag={tagName}
      showAllTags={true}
    />
  );
}

export async function generateStaticParams() {
  const tagSlugs = getAllTagSlugs();
  return tagSlugs.map((tagSlug) => ({
    tag: tagSlug,
  }));
}
