import { cn } from "@/lib/utils";
import React from "react";

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageProps) => {
  return <div className={cn("space-y-6 p-5", className)}>{children}</div>;
};

export const PageSectionTitle = ({ children, className }: PageProps) => {
  return (
    <h2
      className={cn(
        "text-foreground text-xs font-semibold uppercase",
        className,
      )}
    >
      {children}
    </h2>
  );
};

export const PageSection = ({ children, className }: PageProps) => {
  return <div className={cn("space-y-3", className)}>{children}</div>;
};

export const PageSectionScroller = ({ children, className }: PageProps) => {
  return (
    <div
      className={cn(
        "flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
};
