import { getPostsByCategorySlug, getAllCategorySlugs } from '@/lib/posts';
import { getCategoryDisplayName } from '@/lib/slugs';
import { notFound } from 'next/navigation';
import CategoryTagLayout from '@/components/CategoryTagLayout';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categorySlug = decodeURIComponent(category);
  const posts = getPostsByCategorySlug(categorySlug);

  if (posts.length === 0) {
    notFound();
  }

  // URLスラッグから表示名を生成
  const categoryName = getCategoryDisplayName(categorySlug);

  return (
    <CategoryTagLayout
      type="Category"
      name={categoryName}
      posts={posts}
    />
  );
}

export async function generateStaticParams() {
  const categorySlugs = getAllCategorySlugs();
  return categorySlugs.map((categorySlug) => ({
    category: categorySlug,
  }));
}
