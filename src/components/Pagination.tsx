import Link from "next/link";

export default function Pagination({
  currentPage,
   totalPage,
}: {
  currentPage: number;
   totalPage: number;
}) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        marginTop: 24,
        justifyContent: "center",
      }}
    >
      {currentPage > 1 ? (
        <Link href={`/?page=${currentPage - 1}`}>← 上一頁</Link>
      ) : (
        <span style={{ opacity: 0.4 }}>← 上一頁</span>
      )}

      <span>第 {currentPage} 頁 / 共 {totalPage} 頁</span>

        {currentPage < totalPage ? (
        <Link href={`/?page=${currentPage + 1}`}>下一頁 →</Link>
      ) : (
        <span style={{ opacity: 0.4 }}>下一頁 →</span>
      )}
    </nav>
  );
}
