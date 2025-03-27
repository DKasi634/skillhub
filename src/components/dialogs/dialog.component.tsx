
import { LiaTimesSolid } from '@/assets';
import React from 'react';

interface DialogProps {
  className?: string,
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog = ({ className = "", open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return (
    <div className={`${className} fixed inset-0 top-0 bg-black/40 flex items-center justify-center px-4 min-h-screen w-full`}>
      <button
        onClick={() => onOpenChange(false)}
        className="fixed bg-white/60 border shadow-sm shadow-black/50  border-black backdrop-blur-md top-4 right-8 text-black/80 hover:text-gray-700 px-4 py-2 rounded-md"
      >
        <LiaTimesSolid className='text-xl' />
      </button>
      <div className="bg-white rounded-lg p-6 w-full max-w-md ">
        {children}

      </div>
    </div>
  );
};