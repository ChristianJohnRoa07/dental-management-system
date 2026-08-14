import { CardHeader } from "@/components/ui/card";
import { DENTAL_PALETTE } from "@/lib/common/colors";
import { TITLE, APP_NAME } from "@/lib/constants";

function Tooth({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18.5 3C16.5 3 15 4.5 12 6.5C9 4.5 7.5 3 5.5 3C3 3 2 5 2 8c0 4.5 2 9.5 3.5 12.5C6.3 22.1 7.8 22 9 20c.8-1.3 1.5-3 3-3s2.2 1.7 3 3c1.2 2 2.7 2.1 3.5.5C20 17.5 22 12.5 22 8c0-3-1-5-3.5-5z" />
    </svg>
  );
}

export function HeaderTitle() {
  return (
    <CardHeader className="space-y-4 text-center p-0 pb-6">
      {/* Logo Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mx-auto">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: DENTAL_PALETTE.primary.DEFAULT }}
        >
          <Tooth className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl text-slate-900 tracking-tight">
          {TITLE}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug px-2">
        {APP_NAME}
      </h1>
    </CardHeader>
  );
}
