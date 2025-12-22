import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo / Title */}
        <Link href="/" className="font-semibold">
          Image Board
        </Link>

        {/* Nav links */}
        <div className="flex gap-4 text-sm">
          <Link href="/">圖片搜尋</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/guestbook">留言板</Link>
          <Link href="/about">作者介紹</Link>
          <Link href="/login">登入</Link>
        </div>
      </div>
    </nav>
  );
}
