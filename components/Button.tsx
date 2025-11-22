import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-sm",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700",
    danger: "bg-red-900/50 text-red-200 hover:bg-red-900 border border-transparent",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};