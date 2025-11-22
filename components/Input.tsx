import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-zinc-400">{label}</label>}
      <input
        className={`bg-zinc-900 border border-zinc-700 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-zinc-500 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};