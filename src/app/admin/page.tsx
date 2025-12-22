import ImagesManager from "./ImagesManager";
import AdminTabs from "./AdminTabs";
import NewImageForm from "./images/new/NewImageForm";

export default function AdminPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams.tab ?? "manage";

  return (
    <main style={{ maxWidth: 1100, margin: "40px auto" }}>
      <h1>圖片後台</h1>

      {/* Client：只負責切換 URL */}
      <AdminTabs active={tab} />

      {/* Server：真正的內容 */}
      <section style={{ marginTop: 24 }}>
        {tab === "manage" ? (
          <ImagesManager />
        ) : (
          <div> < NewImageForm/> 新增圖片表單</div>
        )}
      </section>
    </main>
  );
}
