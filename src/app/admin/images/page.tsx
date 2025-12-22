import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ImagesClient from "./ImagesClient";

export default async function AdminImagesPage() {
  const supabase = await createSupabaseServerClient();

  // 1) 必須登入
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2) 必須是 staff（用 staff 表判斷）
  const { data: staffRow } = await supabase
    .from("staff")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!staffRow) {
    return <div style={{ padding: 24 }}>你不是 staff，沒有後台權限。</div>;
  }

  // 3) 抓 images
  const { data: images, error } = await supabase
    .from("images")
    .select("id,url,category,keywords,zhuyin,created_at")
    .order("id", { ascending: false });

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        讀取 images 失敗：{error.message}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>管理圖片</h1>
          <p style={{ marginTop: 8, opacity: 0.8 }}>
            你是 staff，可以新增 / 複製網址 / 刪除
          </p>
        </div>

        <Link
          href="/admin/images/new"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            textDecoration: "none",
          }}
        >
          + 新增圖片
        </Link>
      </div>

      <div style={{ marginTop: 18 }}>
        <ImagesClient images={images ?? []} />
      </div>
    </div>
  );
}
