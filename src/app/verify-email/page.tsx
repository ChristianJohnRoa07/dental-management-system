"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VerifyEmailContent } from "@/components/auth/verifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span>Loading...</span>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}