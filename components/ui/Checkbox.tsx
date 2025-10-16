import React from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div>
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`
              w-4 h-4 
              text-primary-600 
              bg-white dark:bg-neutral-800
              border-neutral-300 dark:border-neutral-600 
              rounded 
              focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-error-500" : ""}
              ${className}
            `}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
