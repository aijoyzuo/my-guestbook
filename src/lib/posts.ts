import { supabase } from "@/lib/supabase";
import type { Post } from "@/types/post";
import type { PostgrestError } from "@supabase/supabase-js";

export type FetchPostsResult = {
    posts: Post[];
     totalCount: number;
    error: PostgrestError | null;
};

/**page(一次抓取全部資料，目前用不到)*/
// export async function fetchPosts(): Promise<FetchPostsResult> {
//     const { data, error }: { data: Post[] | null; error: PostgrestError | null } =
//         await supabase
//             .from("posts")
//             .select("id,title,content,created_at")
//             .order("created_at", { ascending: false })
//             .order("id", { ascending: false });

//     return {
//         posts: data ?? [],
//         error,
//     };
// }

/** 取得單篇貼文 */
export type FetchPostByIdResult = {
    post: Post | null;
    error: PostgrestError | null;
}
export async function fetchPostById(id: number): Promise<FetchPostByIdResult> {
    const { data, error }: { data: Post | null; error: PostgrestError | null } =
        await supabase
            .from("posts")
            .select("id,title,content,created_at")
            .eq("id", id)
            .maybeSingle();
    return { post: data, error };
}

/** 上一則/下一則（依 created_at，新→舊） */
export type AdjacentPost = Pick<Post, "id"|"title"|"created_at">;

export type FetchAdjacentResult = {
  prev: AdjacentPost | null; // 比我新的那一篇（上一篇）
  next: AdjacentPost | null; // 比我舊的那一篇（下一篇）
  error: PostgrestError | null;
};

export async function fetchAdjacentPosts(
  createdAt: string
): Promise<FetchAdjacentResult> {
  // prev：created_at 比我大（更新），取最接近我的一筆
  const prevRes = await supabase
    .from("posts")
    .select("id,title,created_at")
    .gt("created_at", createdAt)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  // next：created_at 比我小（更舊），取最接近我的一筆
  const nextRes = await supabase
    .from("posts")
    .select("id,title,created_at")
    .lt("created_at", createdAt)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  const error: PostgrestError | null = prevRes.error ?? nextRes.error ?? null;

  return {
    prev: (prevRes.data as AdjacentPost | null) ?? null,
    next: (nextRes.data as AdjacentPost | null) ?? null,
    error,
  };
}

/** 分頁 */
export async function fetchPostsPage(
  page: number,
  pageSize: number = 5
) {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error,count }=
    await supabase
      .from("posts")
      .select("id,title,content,created_at",{count:"exact"})
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

  return {
    posts: data ?? [],
    totalCount:count?? 0,
    error,
  };
}