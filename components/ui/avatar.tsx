"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, className }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover",
          "h-10 w-10",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-10 w-10 rounded-full items-center justify-center bg-secondary",
        className
      )}
    >
      {fallback || "U"}
    </div>
  );
};