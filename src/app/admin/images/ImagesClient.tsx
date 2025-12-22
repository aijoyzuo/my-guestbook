"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { deleteImageAction, type DeleteImageState } from "./actions";

type ImageRow = {
  id: number;
  url: string;
  category: string | null;
  keywords: string[] | null;
  zhuyin: string[] | null;
  created_at: string;
};

const initialDeleteState: DeleteImageState = { ok: false, message: "" };

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid #ddd",
        cursor: pending ? "not-allowed" : "pointer",
      }}
    >
      {pending ? "刪除中..." : "刪除"}
    </button>
  );
}

function DeleteForm({ id }: { id: number }) {
  const [state, formAction] = React.useActionState(
    deleteImageAction,
    initialDeleteState
  );

  useEffect(() => {
    if (!state?.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
  );
}

export default function ImagesClient({ images }: { images: ImageRow[] }) {
  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("已複製圖片網址");
    } catch {
      toast.error("複製失敗（瀏覽器權限或非 https）");
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {images.length === 0 ? (
        <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
          目前沒有任何圖片資料。
        </div>
      ) : null}

      {images.map((img) => (
        <div
          key={img.id}
          style={{
            border: "1px solid #eee",
            borderRadius: 14,
            padding: 14,
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700 }}>
                #{img.id}{" "}
                <span style={{ fontWeight: 400, opacity: 0.7 }}>
                  {new Date(img.created_at).toLocaleString()}
                </span>
              </div>

              <div style={{ fontSize: 14, opacity: 0.85 }}>
                分類：{img.category ?? "（空）"}
              </div>

              <div style={{ fontSize: 14, opacity: 0.85 }}>
                關鍵字：{img.keywords?.length ? img.keywords.join(" / ") : "（空）"}
              </div>

              <div style={{ fontSize: 14, opacity: 0.85 }}>
                注音：{img.zhuyin?.length ? img.zhuyin.join(" / ") : "（空）"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
              <button
                type="button"
                onClick={() => copy(img.url)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                複製網址
              </button>

              <DeleteForm id={img.id} />
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <a href={img.url} target="_blank" rel="noreferrer" style={{ wordBreak: "break-all" }}>
              {img.url}
            </a>

            <img
              src={img.url}
              alt={`image-${img.id}`}
              style={{
                width: "100%",
                maxHeight: 240,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid #f2f2f2",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
