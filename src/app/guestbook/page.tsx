import Link from "next/link";
import { fetchPostsPage } from "@/lib/posts";
import PostForm from "@/components/PostForm";
import Pagination from "@/components/Pagination";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 5;

export default async function Home({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1"));

  const { posts, totalCount, error } = await fetchPostsPage(currentPage, PAGE_SIZE);
  const totalPage = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (error) {
    return <pre>{error.message}</pre>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>留言板</h1>

      <PostForm />

      <ul style={{ marginTop: 24 }}>
        {posts.map((post) => (
          <li
            key={post.id}
            style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}
          >
            <Link href={`/posts/${post.id}`} style={{ fontWeight: 600 }}>
              {post.title}
            </Link>

            <div
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                whiteSpace: "pre-wrap",
                opacity: 0.8,
                marginTop: 6,
              }}
            >
              {post.content}
            </div>
            {post.content.length > 80 && (
              <div style={{ marginTop: 6 }}>
                <Link href={`/posts/${post.id}`} style={{ fontSize: 14, opacity: 0.9 }}>
                  顯示更多
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Pagination currentPage={currentPage} totalPage={totalPage} />
    </main>
  );
}
