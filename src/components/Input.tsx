"use client";

import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = "",
      disabled = false,
      required = false,
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputClasses = `
      w-full px-3 py-2 
      text-sm text-gray5 
      bg-white border rounded-lg 
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:bg-gray1 disabled:text-gray3 disabled:cursor-not-allowed
      ${
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
          : "border-gray3 focus:border-primary focus:ring-primary/20"
      }
      ${className}
    `.trim();

    const containerClasses = fullWidth ? "w-full" : "";

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray5 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-gray4">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
