import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  readTime: number;
  image?: string;
}

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

  // 読了時間を計算（平均読速度: 200文字/分）
  const readTime = Math.ceil(content.length / 200);

  return {
    slug: realSlug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    date: data.date || '',
    author: data.author || 'はるのすけ',
    tags: data.tags || [],
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