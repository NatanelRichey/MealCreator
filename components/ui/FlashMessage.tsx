'use client';

import { useState, useEffect } from 'react';

interface FlashMessageProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
  autoDismiss?: boolean;
  duration?: number; // milliseconds
}

export function FlashMessage({ 
  type, 
  message, 
  onClose,
  autoDismiss = true,
  duration = 5000 
}: FlashMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  // Using the exact colors from the original project
  const styles = type === 'success' 
    ? 'bg-meal-success-bg border-meal-success-border' // #6aff001f, #6cc82a82
    : 'bg-meal-error-bg border-meal-error-border';    // #ff00002f, #ff00005a

  return (
    <div 
      className={`
        ${styles}
        border-2 
        text-black 
        font-athiti 
        text-sm
        px-3 
        py-2 
        rounded-lg 
        shadow-md
        flex 
        items-center 
        justify-between 
        animate-in 
        fade-in 
        slide-in-from-top-5
        duration-300
        mb-4
        max-w-sm
      `}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        className="ml-3 text-gray-600 hover:text-gray-800 font-athiti text-xl leading-none focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

// Container component for multiple flash messages
interface FlashContainerProps {
  messages: Array<{
    id: string;
    type: 'success' | 'error';
    message: string;
  }>;
  onDismiss: (id: string) => void;
}

export function FlashContainer({ messages, onDismiss }: FlashContainerProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      {messages.map((msg) => (
        <FlashMessage
          key={msg.id}
          type={msg.type}
          message={msg.message}
          onClose={() => onDismiss(msg.id)}
        />
      ))}
    </div>
  );
}

