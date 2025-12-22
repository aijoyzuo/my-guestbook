import NewImageForm from "./NewImageForm";

export default function NewImagePage() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>新增圖片</h1>
      <p style={{ opacity: 0.7, marginBottom: 18 }}>
        這頁只給 staff 用。新增後會自動導回 /admin/images
      </p>

      <NewImageForm />
    </main>
  );
}
