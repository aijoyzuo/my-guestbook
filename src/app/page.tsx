export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">圖片搜尋</h1>

      {/* Search area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="輸入關鍵字（貓 / ㄇㄠ / 節慶）"
          className="flex-1 rounded border px-3 py-2"
        />
        <select className="rounded border px-2">
          <option value="">全部分類</option>
          <option value="animal">動物</option>
          <option value="food">食物</option>
          <option value="festival">節慶</option>
        </select>
        <button className="rounded bg-black px-4 py-2 text-white">
          搜尋
        </button>
      </div>

      {/* Recommended */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">推薦圖片</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex h-32 items-center justify-center rounded border text-sm text-gray-400"
            >
              圖片 {i}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
