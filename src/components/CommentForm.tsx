"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createCommentAction, type CreateCommentState } from "@/lib/actions";

const initialState: CreateCommentState = { ok: false, message: "" };

export default function CommentForm({
  postId,
  parentId,
  placeholder = "留言內容…",
  submitText = "送出留言",
}: {
  postId: number;
  parentId?: number | null;
  placeholder?: string;
  submitText?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createCommentAction,
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
      style={{ display: "grid", gap: 8, marginTop: 12 }}
    >
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="parentId" value={parentId ?? ""} />

      <textarea
        name="content"
        placeholder={placeholder}
        rows={3}
        required
      />

      <button type="submit" disabled={pending}>
        {pending ? "送出中…" : submitText}
      </button>
    </form>
  );
}
