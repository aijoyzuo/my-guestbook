"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createPostAction, type CreatePostState } from "@/lib/guestbook.actions";

const initialState: CreatePostState = { ok: false, message: "" };

export default function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createPostAction,
    initialState
  );

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      style={{ display: "grid", gap: 8, marginTop: 16 }}
    >
      <input name="title" placeholder="暱稱" required />
      <textarea name="content" placeholder="內容" rows={4} required />
      <button type="submit" disabled={pending}>
        {pending ? "送出中…" : "送出"}
      </button>
    </form>
  );
}
