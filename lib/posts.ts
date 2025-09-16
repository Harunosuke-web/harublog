import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, ValidCategory } from './types';
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

  // カテゴリの検証（必須フィールド）
  if (!data.category) {
    throw new Error(`Missing required category in post: ${realSlug}.md`);
  }

  // カテゴリの自動変換マップ
  const categoryMap: { [key: string]: ValidCategory } = {
    'programming': 'Programming',
    'Programming': 'Programming',
    'web-development': 'Web Development',
    'Web Development': 'Web Development',
    'frontend': 'Frontend Development',
    'Frontend Development': 'Frontend Development',
    'フロントエンド': 'Frontend Development',
    'math': 'Mathematics',
    'mathematics': 'Mathematics',
    'Mathematics': 'Mathematics',
    'machine-learning': 'Machine Learning',
    'Machine Learning': 'Machine Learning',
    'apple': 'Apple',
    'Apple': 'Apple',
    'design': 'Design',
    'Design': 'Design',
    'devops': 'DevOps',
    'DevOps': 'DevOps',
    'database': 'Database',
    'Database': 'Database',
    'security': 'Security',
    'Security': 'Security',
    'mobile': 'Mobile Development',
    'Mobile Development': 'Mobile Development',
    'backend': 'Backend Development',
    'Backend Development': 'Backend Development'
  };

  // カテゴリの変換
  const normalizedCategory = categoryMap[data.category];

  if (!normalizedCategory) {
    const validCategories: ValidCategory[] = [
      'Programming',
      'Web Development',
      'Frontend Development',
      'Mathematics',
      'Machine Learning',
      'Apple',
      'Design',
      'DevOps',
      'Database',
      'Security',
      'Mobile Development',
      'Backend Development'
    ];
    throw new Error(`Invalid category "${data.category}" in post: ${realSlug}.md. Valid categories: ${validCategories.join(', ')}`);
  }

  // 本文からの自動excerpt生成（手動記入が優先）
  const generateExcerpt = (content: string): string => {
    return content
      .replace(/^#{1,6}\s+.*$/gm, '')           // 見出し除去
      .replace(/\*\*(.*?)\*\*/g, '$1')         // Bold除去
      .replace(/\*(.*?)\*/g, '$1')             // Italic除去
      .replace(/`(.*?)`/g, '$1')               // インラインコード除去
      .replace(/```[\s\S]*?```/g, '')          // コードブロック除去
      .replace(/!\[.*?\]\(.*?\)/g, '')         // 画像除去
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンク除去（テキストのみ残す）
      .replace(/\n+/g, ' ')                    // 改行をスペースに
      .trim()
      .slice(0, 150)
      .replace(/\s+$/, '') + '...';
  };

  // 読了時間を計算（平均読速度: 200文字/分）
  const readTime = Math.ceil(content.length / 200);

  return {
    slug: realSlug,
    title: data.title || '',
    excerpt: data.excerpt || generateExcerpt(content),
    date: data.date || '',
    author: data.author || 'ハルノスケ',
    tags: data.tags || [],
    category: normalizedCategory,
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
  return allPosts.filter((post) => getCategorySlug(post.category) === categorySlug);
}

export function getPostsByTagSlug(tagSlug: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => {
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
    slugs.add(getCategorySlug(post.category));
  });

  return Array.from(slugs).sort();
}

export function getAllTagSlugs(): string[] {
  const allPosts = getAllPosts();
  const slugs = new Set<string>();

  allPosts.forEach(post => {
    post.tags.forEach(tag => slugs.add(getTagSlug(tag)));
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
    .sort((a, b) => b.count - a.count);
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