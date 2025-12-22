"use client";

import { useRouter } from "next/navigation";

export default function AdminTabs({ active }: { active: string }) {
  const router = useRouter();

  function go(tab: "new" | "manage") {
    router.replace(`/admin?tab=${tab}`);
  }

  return (
    <nav style={{ display: "flex", gap: 12 }}>
      <button onClick={() => go("new")} disabled={active === "new"}>
        新增圖片
      </button>
      <button onClick={() => go("manage")} disabled={active === "manage"}>
        管理圖片
      </button>
    </nav>
  );
}
