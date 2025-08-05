import React, { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    variant = 'default',
    resize = 'vertical',
    className = '',
    disabled,
    rows = 4,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white',
      filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
      outlined: 'border-2 border-gray-300 focus:border-blue-500 focus:ring-0 bg-white'
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const baseClasses = `
      block w-full rounded-md shadow-sm transition-colors duration-200
      placeholder-gray-400 text-gray-900 text-sm px-3 py-2
      focus:outline-none focus:ring-1
      ${variantClasses[variant]}
      ${resizeClasses[resize]}
      ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          rows={rows}
          className={`${baseClasses} ${className}`}
          disabled={disabled}
          {...props}
        />
        
        {(error || helperText) && (
          <p className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
