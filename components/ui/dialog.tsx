"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
//import { DialogProps } from "@radix-ui/react-dialog";
import { createPortal } from "react-dom";

export interface DialogPropsType {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogPropsType> = ({ open, onClose, children }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 max-h-[90vh] w-full max-w-500 m-4 overflow-y-auto bg-background p-6 shadow-lg rounded-lg">
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
    {children}
  </div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const DialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
    {children}
  </div>
);