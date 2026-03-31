import React from 'react';

export function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false
}) {
  const variants = {
    primary: 'border border-[#1C1C1C] text-[#1C1C1C]',
    secondary: 'border border-[#1C1C1C] text-[#1C1C1C]',
    white: 'border border-white text-white'
  };

  return (
    <button
      type={type}
      className={`relative inline-flex items-center justify-center px-8 py-4 text-xs uppercase tracking-[0.2em] overflow-hidden group disabled:opacity-50 ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-[#1C1C1C]" />
      <span className={`relative z-10 group-hover:${variant === 'white' ? 'text-[#1C1C1C]' : 'text-[#F2F0E9]'}`}>
        {children}
      </span>
    </button>
  );
}
