import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

// Reusable Button component — dipakai di seluruh halaman
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
    "inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    primary:
      "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white focus:ring-blue-500 shadow-lg shadow-blue-500/20",
    secondary:
      "bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 focus:ring-slate-500 border border-slate-600",
    danger:
      "bg-red-600 hover:bg-red-500 active:bg-red-700 text-white focus:ring-red-500 shadow-lg shadow-red-500/20",
    ghost:
      "bg-transparent hover:bg-slate-700 active:bg-slate-800 text-slate-300 hover:text-white focus:ring-slate-500",
    success:
      "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white focus:ring-emerald-500 shadow-lg shadow-emerald-500/20",
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
