"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateImageState =
  | { ok: false; message: string }
  | { ok: true; message: string };

export type DeleteImageState =
  | { ok: false; message: string }
  | { ok: true; message: string };

function toArray(raw: string): string[] {
  const parts = raw
    .split(/[,，\n\r\t ]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(parts));
}

export async function createImageAction(
  _prev: CreateImageState,
  formData: FormData
): Promise<CreateImageState> {
  const url = String(formData.get("url") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const keywordsRaw = String(formData.get("keywords") ?? "").trim();
  const zhuyinRaw = String(formData.get("zhuyin") ?? "").trim();

  if (!url) return { ok: false, message: "請輸入圖片網址（url）" };

  try {
    new URL(url);
  } catch {
    return { ok: false, message: "url 看起來不是合法網址" };
  }

  // ⚠️ 你的 table category 是 not null 的話，這裡就不要塞 null
  const category = categoryRaw || "未分類";

  const keywords = keywordsRaw ? toArray(keywordsRaw) : [];
  const zhuyin = zhuyinRaw ? toArray(zhuyinRaw) : [];

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("images").insert({
    url,
    category,
    keywords, // ✅ 對應你表裡的 keywords: text[]
    zhuyin,   // ✅ zhuyin: text[]
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/images");
  return { ok: true, message: "新增成功！" };
}

export async function deleteImageAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  const supabase = await createSupabaseServerClient();

  await supabase.from("images").delete().eq("id", id);

  revalidatePath("/admin/images"); // 讓列表重新抓
}