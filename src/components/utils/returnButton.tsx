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
        "inline-flex items-center justify-center text-xs text-primary hover:underline font-medium bg-transparent border-none p-0 cursor-pointer disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children || title}
    </button>
  );
}