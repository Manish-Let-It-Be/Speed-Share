import React from 'react';
import { Tooltip } from './Tooltip';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  children: React.ReactNode;
}

export function Button({ tooltip, variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = "transition-all duration-300 rounded-lg font-bold relative";
  const variants = {
    primary: "px-6 py-3 bg-primary text-dark hover:bg-primary-dark active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "px-6 py-3 border border-primary/30 text-primary hover:border-primary hover:bg-primary/10 active:scale-95",
    icon: "p-2 text-primary/60 hover:text-primary hover:bg-primary/10 active:scale-95"
  };

  return (
    <Tooltip content={tooltip}>
      <button
        className={`${baseStyles} ${variants[variant]} ${className} hover:animate-glow active:animate-pulse`}
        {...props}
      >
        {children}
      </button>
    </Tooltip>
  );
}