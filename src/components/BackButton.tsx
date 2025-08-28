'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBackOutline } from 'react-icons/io5';

interface BackButtonProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function BackButton({ 
  href = '/', 
  className = '',
  children = 'Back to Events'
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to the provided href
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-green-900/90 px-3 py-2 rounded-md transition-colors backdrop-blur-sm ${className}`}
    >
      <IoArrowBackOutline className="w-4 h-4" />
      {children}
    </button>
  );
}
