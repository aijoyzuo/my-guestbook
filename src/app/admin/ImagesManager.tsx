import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteImageAction } from "@/app/admin/images/actions";
import CopyUrlButton from "@/components/admin/CopyUrlButton";

type ImageRow = {
  id: number;
  url: string;
  category: string | null;
  keywords: string[];
  zhuyin: string[];
  created_at: string;
};

export default async function ImagesManager() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("images")
    .select("id,url,category,keywords,zhuyin,created_at")
    .order("id", { ascending: false });

  if (error) return <div style={{ padding: 24 }}>讀取失敗：{error.message}</div>;

  const images = (data ?? []) as ImageRow[];

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>管理圖片（{images.length}）</h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
        {images.map((img) => (
          <li key={img.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 600 }}>
                  #{img.id} {img.category ? `· ${img.category}` : ""}
                </div>

                <a href={img.url} target="_blank" rel="noreferrer" style={{ wordBreak: "break-all" }}>
                  {img.url}
                </a>

                <div style={{ opacity: 0.8, fontSize: 13 }}>
                  keywords：{(img.keywords ?? []).join("、") || "（空）"} ｜ 注音：
                  {(img.zhuyin ?? []).join(" ") || "（空）"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <CopyUrlButton url={img.url} />

                <form action={deleteImageAction}>
                  <input type="hidden" name="id" value={img.id} />
                  <button type="submit" style={{ padding: "8px 10px", borderRadius: 10 }}>
                    刪除
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
