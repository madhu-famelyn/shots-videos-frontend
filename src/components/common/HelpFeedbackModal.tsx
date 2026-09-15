import { useState } from "react";
import { CheckCircle2, HelpCircle, MessageSquare, Send, Sparkles, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HelpFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpFeedbackModal({ isOpen, onClose }: HelpFeedbackModalProps) {
  const [activeTab, setActiveTab] = useState<"feedback" | "faq" | "report">("feedback");
  const [feedbackType, setFeedbackType] = useState("Show Suggestion");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your message or feedback!");
      return;
    }
    setIsSubmitted(true);
    toast.success("🙏 Thank you! Your feedback has been sent to our Bhojpuri content team.");
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setMessage("");
    setEmail("");
    onClose();
  };

  const FAQS = [
    {
      q: "Is Echo Reels Bhojpuri completely free to watch?",
      a: "Yes! All 2-minute Bhojpuri micro-dramas, short serials, and thrillers are 100% free to stream with zero mandatory subscription fees.",
    },
    {
      q: "Do I need to download an app or sign up to watch?",
      a: "No app download or mandatory login is required. You can start bingeing full episodes instantly in your mobile or desktop browser.",
    },
    {
      q: "How does the 👏 CLAP feature work?",
      a: "The CLAP feature lets you cheer and support your favorite Bhojpuri actors, writers, and creators. Tap the clap button to send animated cheers.",
    },
    {
      q: "How often are new Bhojpuri episodes released?",
      a: "New Bhojpuri micro-episodes and short serial chapters drop daily at 8:00 PM.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-900 via-black to-black p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 active:scale-95"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
            <HelpCircle className="size-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              Help & Feedback
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Echo Reels Bhojpuri 24/7 Creator & Viewer Support
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("feedback")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
              activeTab === "feedback"
                ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            Send Feedback
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
              activeTab === "faq"
                ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            Quick FAQ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("report")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
              activeTab === "report"
                ? "bg-red-500 text-white font-bold shadow-md shadow-red-500/20"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            Report Issue
          </button>
        </div>

        {/* Tab 1: Feedback Form */}
        {activeTab === "feedback" && (
          <div>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/80 mb-1">
                    Feedback Topic
                  </label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Show Suggestion">Suggest a Bhojpuri Show / Actor Idea</option>
                    <option value="Video Quality">Video / Audio Quality Improvement</option>
                    <option value="Feature Request">New Feature Request</option>
                    <option value="General">General Compliment or Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-white/80 mb-1">
                    Your Email (Optional, for response)
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-white/80 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you love or what Bhojpuri content you want to see next..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder:text-white/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-amber-400 py-3 text-xs font-bold text-black shadow-xl shadow-amber-400/20 transition hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <Send className="size-3.5" />
                  <span>Send Feedback</span>
                </button>
              </form>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400">
                  <CheckCircle2 className="size-7" />
                </div>
                <h4 className="mt-3 font-display text-xl font-bold text-white">
                  Feedback Received!
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Our team reads every response to bring you the best Bhojpuri entertainment.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-5 w-full rounded-full bg-white/10 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: FAQ */}
        {activeTab === "faq" && (
          <div className="no-scrollbar max-h-72 overflow-y-auto space-y-3 pr-1">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-white/5 bg-white/5 p-3.5">
                <p className="text-xs font-bold text-amber-300">{faq.q}</p>
                <p className="mt-1 text-xs text-white/75 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Report Issue */}
        {activeTab === "report" && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/30 border border-red-500/20 text-xs text-red-300">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>Experiencing playback stutter, audio sync, or broken episode links?</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/80 mb-1">
                Describe the Issue
              </label>
              <textarea
                rows={4}
                required
                placeholder="Mention which episode or series is having trouble..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-red-600 py-3 text-xs font-bold text-white shadow-xl shadow-red-600/20 transition hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <Send className="size-3.5" />
              <span>Submit Issue Report</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
