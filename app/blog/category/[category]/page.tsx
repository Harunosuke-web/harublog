import { getPostsByCategorySlug, getAllCategorySlugs } from '@/lib/posts';
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

  const categoryName = posts[0].category;

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
