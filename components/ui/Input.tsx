interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Extends standard HTML input props for maximum flexibility
  className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
  // Minimal Input component - add styling via className prop
  // Base styles only: font inheritance and basic focus behavior
  // 
  // Usage examples:
  //
  // Transparent (inline editing):
  //   <Input className="bg-transparent border-none text-lg px-3 py-2" />
  //
  // Form input (white background):
  //   <Input className="bg-white border border-gray-300 rounded px-4 py-2 text-lg focus:ring-2 focus:ring-meal-green" />
  //
  // Search input:
  //   <Input type="search" className="w-full px-4 py-2 rounded-lg border" />
  
  return (
    <input
      {...props}
      className={`font-athiti focus:outline-none ${className}`}
    />
  );
}

