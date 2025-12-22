"use client";

import React, { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createImageAction, type CreateImageState } from "../actions";

const initialState: CreateImageState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "新增中..." : "新增圖片"}
    </button>
  );
}

export default function NewImageForm() {
  const router = useRouter();
  const [state, formAction] = React.useActionState(createImageAction, initialState);

  useEffect(() => {
    if (!state?.message) return;

    if (state.ok) {
      toast.success(state.message);
      router.push("/admin/images"); // ✅ 成功再轉跳（toast 不會被吃掉）
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} style={{ display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <div>圖片網址 URL（必填）</div>
        <input name="url" required placeholder="https://....jpg" />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <div>全部分類（可空，空的話會存「未分類」）</div>
        <input name="category" placeholder="例如：動物 / 風景 / 插畫 ..." />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <div>注音（array；用空白/逗號分隔）</div>
        <input name="zhuyin" placeholder="例如：ㄇㄠ ㄎㄜˇ ㄞˋ" />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <div>關鍵字 keywords（array；用空白/逗號分隔）</div>
        <input name="keywords" placeholder="例如：cat cute animal 或 貓 可愛 動物" />
      </label>

      <SubmitButton />
    </form>
  );
}
