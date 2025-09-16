import { getPostsByTagSlug, getAllTagSlugs } from '@/lib/posts';
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

  // カスタムスラッグまたは自動生成スラッグから元のタグ名を取得
  let tagName = tagSlug;
  for (const post of posts) {
    const tagIndex = post.tagSlugs?.indexOf(tagSlug);
    if (tagIndex !== undefined && tagIndex >= 0) {
      tagName = post.tags[tagIndex];
      break;
    }
    // フォールバック: 自動生成スラッグで検索
    const autoTag = post.tags.find(tag =>
      tag.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-') === tagSlug
    );
    if (autoTag) {
      tagName = autoTag;
      break;
    }
  }

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
