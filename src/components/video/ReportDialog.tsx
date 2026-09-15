import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { videoApi } from "@/services/api/videoApi";
import type { ReportReason } from "@/types/video";

const REASONS: Array<{ value: ReportReason; label: string }> = [
  { value: "spam", label: "Spam" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "violence", label: "Violence" },
  { value: "copyright", label: "Copyright" },
  { value: "misleading", label: "Misleading" },
  { value: "other", label: "Other" },
];

export function ReportDialog({
  videoId,
  open,
  onOpenChange,
}: {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [reason, setReason] = useState<ReportReason>("spam");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await videoApi.report(videoId, { reason, description });
      toast.success("Report sent", { description: "Thanks — our team will review this video." });
      onOpenChange(false);
      setDescription("");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report this video</DialogTitle>
          <DialogDescription>Tell us what's wrong. Reports stay anonymous.</DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={reason}
          onValueChange={(v) => setReason(v as ReportReason)}
          className="gap-2"
        >
          {REASONS.map((r) => (
            <Label
              key={r.value}
              htmlFor={`reason-${r.value}`}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm has-[:checked]:border-brand"
            >
              <RadioGroupItem id={`reason-${r.value}`} value={r.value} />
              {r.label}
            </Label>
          ))}
        </RadioGroup>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more detail (optional)"
          aria-label="Additional detail"
          className="min-h-20 rounded-xl"
        />

        <Button
          onClick={() => void submit()}
          disabled={submitting}
          className="min-h-11 w-full rounded-full"
        >
          {submitting ? "Sending…" : "Submit report"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
