import { Eye, EyeOff } from "lucide-react";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, type, className = "", ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === "password";
        return (
            <div className="flex flex-col gap-1 w-full">
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={isPassword ? (showPassword ? "text" : "password") : type}
                        className={`w-full border rounded-lg px-3 py-2 text-sm bg-background-input focus:outline-none focus:ring-2 focus:ring-accent-gray
                        ${icon ? "pl-10" : "pl-3"}
                        ${error ? "border-red-400 ring-2 ring-red-400/40" : "border-gray-300"}
                        ${isPassword ? "pr-10" : ""}
                        ${className}`}
                        {...props}
                    />
                    {isPassword && (
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </div>
                    )}

                </div>

                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";