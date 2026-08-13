import { ButtonHTMLAttributes } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReturnButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  onClickFunction?: () => void;
}

export function ReturnButton({
  onClick,
  onClickFunction,
  title = "Back",
  className,
  children,
  ...props
}: ReturnButtonProps) {
  const handleClick = onClick || onClickFunction;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center text-xs font-semibold text-slate-800 hover:text-slate-900 hover:underline bg-transparent border-none p-0 cursor-pointer transition-colors disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ArrowLeft className="mr-2 h-3.5 w-3.5 text-slate-700" />
      {children || title}
    </button>
  );
}