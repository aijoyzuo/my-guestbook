import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fetchPostById,
  fetchAdjacentPosts,
  type AdjacentPost,
} from "@/lib/posts";

import { fetchCommentsByPostId } from "@/lib/comments";
import type { Comment } from "@/types/comment";
import CommentForm from "@/components/CommentForm";

type PageParams = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PageParams) {
  const { id } = await params;

  const postId = Number(id);
  if (!Number.isFinite(postId)) notFound();

  // 先抓文章
  const { post, error } = await fetchPostById(postId);
  if (error) return <pre>{error.message}</pre>;
  if (!post) notFound();

  // 再抓留言（需要 postId）
  const { comments, error: cError } = await fetchCommentsByPostId(postId);

  // 上一則 / 下一則（需要 post.created_at）
  const { prev, next, error: adjError } = await fetchAdjacentPosts(
    post.created_at
  );

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <Link href="/">← 回首頁</Link>

      <h1 style={{ marginTop: 12 }}>{post.title}</h1>
      <p style={{ opacity: 0.7, marginTop: 6 }}>
        {new Date(post.created_at).toLocaleString("zh-TW")}
      </p>

      <article style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
        {post.content}
      </article>

      <section style={{ marginTop: 32 }}>
        <h2>留言</h2>

        {/* 最上層留言 */}
        <CommentForm
          postId={post.id}
          parentId={null}
          placeholder="寫下留言…"
          submitText="送出留言"
        />

        {cError ? (
          <pre style={{ marginTop: 16 }}>{cError.message}</pre>
        ) : (
          <CommentTree comments={comments} postId={post.id} />
        )}
      </section>

      {adjError ? (
        <pre style={{ marginTop: 24 }}>{adjError.message}</pre>
      ) : (
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 24,
          }}
        >
          <AdjacentLink kind="prev" post={prev} />
          <AdjacentLink kind="next" post={next} />
        </nav>
      )}
    </main>
  );
}

function AdjacentLink({
  kind,
  post,
}: {
  kind: "prev" | "next";
  post: AdjacentPost | null;
}) {
  if (!post) return <span />;

  return kind === "prev" ? (
    <Link href={`/posts/${post.id}`}>← 上一則：{post.title}</Link>
  ) : (
    <Link href={`/posts/${post.id}`}>下一則：{post.title} →</Link>
  );
}

/** ----- Comments tree rendering ----- */

type CommentNode = Comment & { children: CommentNode[] };

function CommentTree({ comments, postId }: { comments: Comment[]; postId: number }) {
  const nodes = buildTree(comments);

  if (nodes.length === 0) {
    return <p style={{ opacity: 0.7, marginTop: 16 }}>還沒有留言</p>;
  }

  return (
    <div style={{ marginTop: 16 }}>
      {nodes.map((node) => (
        <CommentItem key={node.id} node={node} postId={postId} depth={0} />
      ))}
    </div>
  );
}

function buildTree(comments: Comment[]): CommentNode[] {
  const map = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, children: [] });
  }

  for (const c of comments) {
    const node = map.get(c.id)!;

    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function CommentItem({
  node,
  postId,
  depth,
}: {
  node: CommentNode;
  postId: number;
  depth: number;
}) {
  return (
    <div
      style={{
        borderLeft: depth > 0 ? "2px solid #eee" : "none",
        paddingLeft: depth > 0 ? 12 : 0,
        marginTop: 12,
      }}
    >
      <div style={{ opacity: 0.7, fontSize: 12 }}>
        {new Date(node.created_at).toLocaleString("zh-TW")}
      </div>

      <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
        {node.content}
      </div>

      <CommentForm
        postId={postId}
        parentId={node.id}
        placeholder="回覆這則留言…"
        submitText="回覆"
      />

      {node.children.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {node.children.map((child) => (
            <CommentItem
              key={child.id}
              node={child}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
