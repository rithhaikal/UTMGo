import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import { supabase } from "../../lib/supabaseClient";
import { useUserPreferences } from "../../lib/UserPreferencesContext";

interface ResetLinkSentScreenProps {
  onNavigate: (screen: string) => void;
}

export function ResetLinkSentScreen({ onNavigate }: ResetLinkSentScreenProps) {
  const { theme } = useUserPreferences();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";

  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleResend = async () => {
    if (!email) {
      setResendMsg("Unable to resend — please request a new link.");
      return;
    }
    setResending(true);
    setResendMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password-new`,
    });
    setResending(false);
    setResendMsg(error ? "Failed to resend. Try again." : "Link resent! Check your inbox.");
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: theme.background }} // Mengikut latar belakang tema
    >
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          {/* Mail Icon */}
          <div className="flex justify-center mb-6">
            <Mail
              className="w-16 h-16"
              strokeWidth={1.5}
              style={{ color: theme.primary }} // Menggunakan warna utama tema
            />
          </div>

          {/* Title */}
          <h1
            className="mb-3"
            style={{
              color: theme.primary, // Mengikut warna primary tema
              fontWeight: "600",
              fontSize: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            Check Your Email
          </h1>

          {/* Subtitle */}
          <p
            className="mb-8 mx-auto"
            style={{
              color: theme.textSecondary, // Mengikut warna teks sekunder tema
              lineHeight: "1.6",
              fontSize: "15px",
              maxWidth: "80%",
            }}
          >
            We've sent a password reset link to your email. Please check your
            inbox or spam folder.
          </p>

          {/* Return to Login Button */}
          <Button
            onClick={() => onNavigate("login")}
            className="w-full h-12 flex items-center justify-center transition-all active:scale-95"
            style={{
              backgroundColor: theme.primary, // Butang mengikut warna primary tema
              color: "#FFFFFF",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            Return to Login
          </Button>

          {/* Resend Link */}
          <div className="text-center pt-6">
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              Didn't receive the email?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="underline font-semibold disabled:opacity-50"
                style={{ color: theme.primary }}
              >
                {resending ? "Sending..." : "Resend Link"}
              </button>
            </p>
            {resendMsg && (
              <p className="text-sm mt-2" style={{ color: resendMsg.includes("resent") ? theme.primary : "#EF4444" }}>
                {resendMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center mt-auto">
        <p className="text-xs" style={{ color: theme.textSecondary, lineHeight: "1.6" }}>
          UTMGo+ Sport Facility Booking System
        </p>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}