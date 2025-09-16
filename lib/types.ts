// 許可されたカテゴリ名（英語のみ、SEO最適化）
export type ValidCategory =
  | 'Programming'
  | 'Web Development'
  | 'Frontend Development'
  | 'Mathematics'
  | 'Machine Learning'
  | 'Apple'
  | 'Design'
  | 'DevOps'
  | 'Database'
  | 'Security'
  | 'Mobile Development'
  | 'Backend Development';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  category: ValidCategory; // 必須の英語カテゴリ
  tags?: string[]; // オプショナル（空配列でも可）
  image?: string;
  readTime?: number;
}