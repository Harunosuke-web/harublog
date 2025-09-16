import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from './types';
import { getCategorySlug, getTagSlug } from './slugs';

// Re-export for backward compatibility
export { getCategorySlug, getTagSlug };

const postsDirectory = path.join(process.cwd(), 'posts');

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter((name) => name.endsWith('.md'));
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // categorySlugが存在しない場合はエラーを出す
  if (!data.categorySlug) {
    throw new Error(`Missing required categorySlug in post: ${realSlug}.md`);
  }

  // 読了時間を計算（平均読速度: 200文字/分）
  const readTime = Math.ceil(content.length / 200);

  return {
    slug: realSlug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    date: data.date || '',
    author: data.author || 'ハルノスケ',
    tags: data.tags || [],
    category: data.category || '未分類',
    categorySlug: data.categorySlug,
    tagSlugs: data.tagSlugs || (data.tags || []).map((tag: string) => getTagSlug(tag)),
    content,
    readTime,
    image: data.image || `https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=400&fit=crop&crop=smart`,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}

export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getPostsByCategorySlug(categorySlug: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.categorySlug === categorySlug);
}

export function getPostsByTagSlug(tagSlug: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => {
    // カスタムスラッグが設定されている場合はそれを使用
    if (post.tagSlugs?.includes(tagSlug)) {
      return true;
    }
    // フォールバック: 自動生成スラッグと比較
    return post.tags.some(tag => getTagSlug(tag) === tagSlug);
  });
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = [...new Set(allPosts.map((post) => post.category))];
  return categories.sort();
}

export function getAllCategorySlugs(): string[] {
  const allPosts = getAllPosts();
  const slugs = new Set<string>();

  allPosts.forEach(post => {
    slugs.add(post.categorySlug);
  });

  return Array.from(slugs).sort();
}

export function getAllTagSlugs(): string[] {
  const allPosts = getAllPosts();
  const slugs = new Set<string>();

  allPosts.forEach(post => {
    // カスタムスラッグが設定されている場合はそれを使用
    if (post.tagSlugs) {
      post.tagSlugs.forEach(slug => slugs.add(slug));
    } else {
      // フォールバック: 自動生成スラッグ
      post.tags.forEach(tag => slugs.add(getTagSlug(tag)));
    }
  });

  return Array.from(slugs).sort();
}

export function getCategoryWithCount(): Array<{ category: string; count: number }> {
  const allPosts = getAllPosts();
  const categoryCount: { [key: string]: number } = {};

  allPosts.forEach((post) => {
    categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
  });

  return Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const allTags = allPosts.flatMap((post) => post.tags);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}

export function getTagWithCount(): Array<{ tag: string; count: number }> {
  const allPosts = getAllPosts();
  const tagCount: { [key: string]: number } = {};

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count); // 記事数の多い順
}