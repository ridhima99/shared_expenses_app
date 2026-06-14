import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ name, label, error, children }) => {
  return (
    <div className="space-y-2">
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};