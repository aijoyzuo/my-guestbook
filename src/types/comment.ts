export type Comment = {
  id: number;
  post_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
};