"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CreatePostState =
  | { ok: false; message: string }
  | { ok: true; message: string };

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    return { ok: false, message: "標題和內容都要填喔" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").insert({ title, content });

  if (error) {
    return { ok: false, message: error.message };
  }

  // 讓首頁重新抓資料（你現在首頁就是抓 posts）
  revalidatePath("/");

  return { ok: true, message: "新增成功！" };
}


export type CreateCommentState =
  | { ok: false; message: string }
  | { ok: true; message: string };

export async function createCommentAction(
  _prevState: CreateCommentState,
  formData: FormData
): Promise<CreateCommentState> {
  const postId = Number(formData.get("postId"));
  const parentIdRaw = formData.get("parentId");
  const parentId =
    parentIdRaw === null || String(parentIdRaw) === "" ? null : Number(parentIdRaw);

  const content = String(formData.get("content") ?? "").trim();

  if (!Number.isFinite(postId)) return { ok: false, message: "postId 不正確" };
  if (parentId !== null && !Number.isFinite(parentId))
    return { ok: false, message: "parentId 不正確" };
  if (!content) return { ok: false, message: "留言內容不能空白" };
  
 const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    parent_id: parentId,
    content,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/posts/${postId}`);
  return { ok: true, message: "留言成功！" };
}