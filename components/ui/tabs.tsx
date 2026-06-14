"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={cn(className)} data-value={activeTab}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => (
  <div className={cn("flex space-x-2 border-b mb-4", className)}>
    {children}
  </div>
);

export const TabsTrigger: React.FC<TabsTriggerProps & { activeTab?: string; setActiveTab?: (v: string) => void }> = ({
  value,
  children,
  className,
  activeTab,
  setActiveTab,
}) => (
  <button
    className={cn(
      "px-4 py-2 text-sm font-medium transition-colors",
      activeTab === value
        ? "text-primary border-b-2 border-primary"
        : "text-muted-foreground hover:text-primary",
      className
    )}
    onClick={() => setActiveTab && setActiveTab(value)}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<TabsContentProps & { activeTab?: string }> = ({
  value,
  children,
  className,
  activeTab,
}) => {
  if (activeTab !== value) return null;
  return <div className={cn(className)}>{children}</div>;
};