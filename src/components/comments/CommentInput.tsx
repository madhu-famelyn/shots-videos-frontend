import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CommentInput({
  onSubmit,
  pending,
}: {
  onSubmit: (text: string) => void;
  pending: boolean;
}) {
  const [text, setText] = useState("");

  return (
    <form
      className="flex items-center gap-2 border-t border-border bg-background p-3"
      onSubmit={(e) => {
        e.preventDefault();
        const value = text.trim();
        if (!value) return;
        onSubmit(value);
        setText("");
      }}
    >
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment…"
        aria-label="Add a comment"
        className="min-h-11 rounded-full bg-secondary"
      />
      <Button
        type="submit"
        disabled={pending || text.trim().length === 0}
        aria-label="Post comment"
        className="min-h-11 min-w-11 rounded-full"
      >
        <SendHorizonal className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
