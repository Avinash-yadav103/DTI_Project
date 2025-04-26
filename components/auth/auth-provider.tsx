"use client"

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isLoading } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return <>{children}</>;
}