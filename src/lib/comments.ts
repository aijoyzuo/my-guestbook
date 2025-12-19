import { supabase } from "@/lib/supabase";
import type { Comment } from "@/types/comment";
import type { PostgrestError } from "@supabase/supabase-js";

export type FetchCommentsResult = {
  comments: Comment[];
  error: PostgrestError | null;
};

export async function fetchCommentsByPostId(
  postId: number
): Promise<FetchCommentsResult> {
  const { data, error }: { data: Comment[] | null; error: PostgrestError | null } =
    await supabase
      .from("comments")
      .select("id,post_id,parent_id,content,created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });

  return { comments: data ?? [], error };
}
