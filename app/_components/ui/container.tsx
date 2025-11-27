import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;

  maxWidthClass?: string;

  className?: string;
}

export function Container({
  children,
  maxWidthClass = "max-w-7xl",
  className = "",
}: ContainerProps) {
  return (
    <div className={`w-full ${maxWidthClass} mx-auto ${className}`}>
      {children}
    </div>
  );
}
