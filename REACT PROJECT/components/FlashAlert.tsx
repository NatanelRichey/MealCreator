'use client';

interface FlashAlertProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function FlashAlert({ type, message, onClose }: FlashAlertProps) {
  // TODO: Implement flash alert messages
  // Reference: public/css/tablet.css lines 680-693
  // 
  // Use:
  // - bg-meal-success-bg and border-meal-success-border for success
  // - bg-meal-error-bg and border-meal-error-border for error
  // - Close button
  
  return (
    <div 
      id={type === 'success' ? 'flash-success' : 'flash-error'}
      className=""
    >
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
}

