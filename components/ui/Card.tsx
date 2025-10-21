interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  // TODO: Implement card wrapper with Tailwind
  // Use bg-white, rounded-lg, shadow-md styling
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  // TODO: Card header styling
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  // TODO: Card body styling
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}

