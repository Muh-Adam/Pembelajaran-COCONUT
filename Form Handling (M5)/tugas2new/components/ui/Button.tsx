import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success" | "warning";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    primary:
      "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white focus:ring-emerald-500 shadow-lg shadow-emerald-500/20",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500 border border-slate-600",
    danger:
      "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-lg shadow-red-500/20",
    ghost:
      "bg-transparent hover:bg-slate-700 text-slate-300 hover:text-white focus:ring-slate-500",
    success:
      "bg-teal-600 hover:bg-teal-500 text-white focus:ring-teal-500 shadow-lg shadow-teal-500/20",
    warning:
      "bg-amber-600 hover:bg-amber-500 text-white focus:ring-amber-500 shadow-lg shadow-amber-500/20",
  };

  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
