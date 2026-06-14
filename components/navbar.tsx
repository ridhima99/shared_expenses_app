"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/session";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <nav className="border-b bg-background">
      <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
        <Link href="/dashboard/dashboard" className="text-xl font-bold">
          Shared Expenses
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard/dashboard" className="text-sm hover:text-primary">
            Dashboard
          </Link>
          <Link href="/dashboard/groups" className="text-sm hover:text-primary">
            Groups
          </Link>
          
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}