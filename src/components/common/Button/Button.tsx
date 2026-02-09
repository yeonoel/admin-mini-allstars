import React from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeStyles: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
};

export function Button({ variant = "primary", size = "md", loading = false, disabled, children, className = "", ...props }: ButtonProps) {
    return (
        <button
            className={`rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}
