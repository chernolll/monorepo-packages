'use client';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className = '' }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded bg-blue-500 text-[red] hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  );
}
