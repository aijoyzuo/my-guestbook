"use client";

import { toast } from "sonner";

export default function CopyUrlButton({ url }: { url: string }) {
  return (
    <button
      type="button"
      style={{
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid #ccc",
        cursor: "pointer",
      }}
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        toast.success("已複製 URL");
      }}
    >
      複製 URL
    </button>
  );
}
