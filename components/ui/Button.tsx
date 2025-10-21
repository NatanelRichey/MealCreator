interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: ButtonProps) {
  // Step 1: Base classes ✅
  // Step 2: Variant-specific colors ✅
  // Step 3: Size variations ✅
  // Step 4: Disabled state & final assembly ✅
  // Complete! 🎉
  
  // Base classes that ALL buttons share
  const baseClasses = "font-athiti rounded transition-colors duration-200 focus:outline-none flex items-center justify-center";
  
  // Variant-specific colors (based on old design)
  const variantClasses = {
    primary: 'bg-meal-green-dark text-white hover:bg-meal-green',       // Dark green (#49a705)
    secondary: 'bg-meal-grey text-white hover:bg-gray-600',             // Grey (#6f6f6f)
    success: 'bg-meal-green-light text-meal-green-dark hover:bg-meal-green-hover', // Light green (#6cc82a47)
  }[variant];
  
  // Size variations (based on old design)
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm min-w-[70px] h-[30px]',        // Small: mobile buttons
    md: 'px-4 py-2 text-base min-w-[110px] h-[43px]',     // Medium: standard
    lg: 'px-6 py-3 text-lg min-w-[170px] h-[45px]',       // Large: important actions
  }[size];
  
  // Disabled state
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}

