import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/services/api/authApi";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign Up / Sign In — Echo Reels Bhojpuri" },
      {
        name: "description",
        content: "Enter your mobile number to stream original Bhojpuri 2-minute micro-dramas on Echo Reels.",
      },
      { property: "og:title", content: "Sign In — Echo Reels Bhojpuri" },
      { property: "og:description", content: "Fast mobile OTP login for Echo Reels." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const loginWithPhone = useAuthStore((s) => s.loginWithPhone);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [isTimerActive, countdown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      await authApi.sendOtp(cleanDigits);
      setStep("otp");
      setOtp("");
      setCountdown(30);
      setIsTimerActive(true);
      toast.success(`OTP sent to +91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`);
    } catch (err) {
      toast.error("Failed to send OTP", { description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp.trim() || otp.trim().length < 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await loginWithPhone({
        phone: phone.replace(/\D/g, ""),
        otp: otp.trim(),
      });
      toast.success("Welcome to Echo Reels!");
      void navigate({ to: "/feed", replace: true });
    } catch (err) {
      toast.error("Login failed", { description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Big Centered Brand Logo */}
      <div className="mb-6 flex flex-col items-center">
        <BrandLogo className="scale-125" showName={true} />
      </div>

      {step === "phone" ? (
        /* STEP 1: CHAI SHOTS MOBILE LOGIN FORM */
        <div className="w-full space-y-6">
          <h1 className="text-center font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sign Up/Sign In
          </h1>

          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Phone Number Input Row (Rectangle Shaped +91 ⌄ | Enter phone number) */}
            <div className="flex items-center gap-2.5">
              {/* +91 Country Rectangle Box */}
              <div className="flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-zinc-900/90 px-3.5 py-3.5 text-sm font-bold text-white shadow-md shrink-0 select-none">
                <span>+91</span>
                <ChevronDown className="size-4 text-white/70" />
              </div>

              {/* Rectangle Phone Number Input Field */}
              <div className="relative flex-1">
                <Input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="h-13 w-full rounded-lg border-white/20 bg-zinc-900/90 px-4 text-sm font-semibold text-white placeholder:text-white/40 focus-visible:border-amber-400 focus-visible:ring-1 focus-visible:ring-amber-400 shadow-md"
                  autoFocus
                />
              </div>
            </div>

            {/* Rectangle Send OTP Button */}
            <Button
              type="submit"
              disabled={loading || phone.replace(/\D/g, "").length < 10}
              className="h-13 w-full rounded-lg bg-[#c99500] text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>

            {/* Terms and Privacy Disclaimer */}
            <p className="pt-2 text-center text-xs text-white/65 leading-relaxed">
              By continuing, you accept our{" "}
              <Link to="/settings" className="font-bold text-white hover:underline">
                T&C
              </Link>{" "}
              and{" "}
              <Link to="/settings" className="font-bold text-white hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      ) : (
        /* STEP 2: OTP VERIFICATION */
        <div className="w-full space-y-6">
          <div className="text-center">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Enter Verification Code
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Sent 4-digit code to +91 {phone}{" "}
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="font-bold text-amber-400 hover:underline ml-1 cursor-pointer"
              >
                (Edit)
              </button>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="relative">
              <Input
                id="otp-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-14 rounded-lg border-white/20 bg-zinc-900/90 text-center text-2xl font-bold tracking-widest text-white placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-white/40 focus-visible:border-amber-400 focus-visible:ring-1 focus-visible:ring-amber-400 shadow-md"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={loading || otp.trim().length < 4}
              className="h-13 w-full rounded-lg bg-[#c99500] text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>

            {/* Resend Timer */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-muted-foreground">Didn't get the code?</span>
              {isTimerActive ? (
                <span className="font-semibold text-white/70">Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="flex items-center gap-1 font-bold text-amber-400 hover:underline cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Resend OTP</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </AuthLayout>
  );
}
