import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  verifyEmail,
  resetVerifyEmailState,
} from "@/lib/redux/slice/auth/verifyEmailSlice";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const urlStatus = searchParams.get("status");
  const urlMessage = searchParams.get("message");

  const dispatch = useAppDispatch();
  const { status, errorMessage } = useAppSelector((state) => state.verifyEmail);

  useEffect(() => {
    if (urlStatus) {
      return;
    }

    if (token) {
      dispatch(verifyEmail(token));
    }

    return () => {
      dispatch(resetVerifyEmailState());
    };
  }, [token, urlStatus, dispatch]);

  const isSuccess = urlStatus === "success" || status === "success";
  const isError =
    urlStatus === "error" || status === "error" || (!token && !urlStatus);

  const displayError =
    urlMessage ||
    errorMessage ||
    "No verification token or status was provided.";

  const isLoading =
    (status === "loading" || status === "idle") && !urlStatus && Boolean(token);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center transition-all">
      {/* Brand Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-3xl">🦷</span>
        <span className="font-bold text-slate-800 text-xl tracking-tight">
          Dr. Jones Portal
        </span>
      </div>

      {/* 1. LOADING STATE */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Verifying your email...
          </h2>
          <p className="text-sm text-slate-500">
            Please wait while we confirm your account credentials.
          </p>
        </div>
      )}

      {/* 2. SUCCESS STATE */}
      {isSuccess && (
        <div className="py-4 flex flex-col items-center">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Email Verified!
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your account has been successfully verified. You can now access your
            account and manage appointments.
          </p>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-md transition-colors"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* 3. ERROR STATE */}
      {!isSuccess && isError && (
        <div className="py-4 flex flex-col items-center">
          <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {displayError}
          </p>
          <div className="w-full space-y-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}

      {/* Footer Security Badge */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-slate-400" />
        <span>Secure Dental Management Authentication</span>
      </div>
    </div>
  );
}
