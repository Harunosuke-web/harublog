export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  categorySlug: string;   // URL用カテゴリスラッグ（必須）
  tags: string[];
  tagSlugs?: string[];    // URL用タグスラッグ配列
  image?: string;
  readTime?: number;
}