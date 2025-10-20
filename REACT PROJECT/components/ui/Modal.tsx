interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // TODO: Implement modal/popup
  // Use fixed positioning, backdrop with bg-black/50
  // Close on backdrop click, ESC key
  
  if (!isOpen) return null;

  return (
    <div className="">
      {/* Backdrop */}
      <div onClick={onClose} />
      
      {/* Modal Content */}
      <div>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

