import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  // 1) 先檢查是否登入
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 2) 再檢查是否 staff（用你 public.staff 表）
  const { data: staffRow } = await supabase
    .from("staff")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!staffRow) redirect("/login"); // 或 redirect("/403")

  return <>{children}</>;
}
