// src/types/post.ts
export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string; // Supabase 會用字串回傳 timestamptz（ISO 格式）
};
