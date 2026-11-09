"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage("برجاء إدخال كلمة المرور (Please enter your password)");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful login: navigate to admin
        router.push(from);
        router.refresh();
      } else {
        setErrorMessage(data.message || "كلمة المرور غير صحيحة، حاول مجددًا (Invalid password)");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setErrorMessage("حدث خطأ في الاتصال، برجاء المحاولة لاحقًا (Connection error)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center animate-in fade-in">
          {errorMessage}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-bold uppercase tracking-wider text-[#33272A]"
        >
          Password / كلمة المرور
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <KeyRound className="w-4 h-4" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة مرور الإدارة..."
            autoFocus
            className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm font-sans transition-all bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B89335] hover:opacity-95 hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>جاري التحقق...</span>
          </span>
        ) : (
          <>
            <span>دخول لوحة التحكم</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] flex items-center justify-center p-4 select-none">
      {/* Decorative Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-[#F2D98D]/50 shadow-2xl p-8 sm:p-10 space-y-6">
        {/* Header with Luxury Shield & Rings Icon */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F2D98D] p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-[#2B1D24] rounded-2xl flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-7 h-7" />
            </div>
          </div>

          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-[#B89335] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin Authentication</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#2B1D24] tracking-tight">
              لوحة التحكم المحمية
            </h1>
            <p className="text-xs text-[#7B6A6E] font-medium">
              أدخل كلمة المرور لتخصيص محتوى وتفاصيل تجربة الزفاف
            </p>
          </div>
        </div>

        {/* Single Password Form wrapped in Suspense boundary */}
        <Suspense
          fallback={
            <div className="py-8 text-center text-xs text-gray-400 animate-pulse">
              جاري تجهيز نموذج الدخول...
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>

        {/* Footer Hint & Back Link */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#7B6A6E]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#2B1D24] font-medium transition-colors"
          >
            <span>← العودة للموقع الرئيسي</span>
          </Link>
          <div className="flex items-center gap-1 font-mono text-[11px] text-gray-400">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Secured with HttpOnly Cookies</span>
          </div>
        </div>
      </div>
    </div>
  );
}
