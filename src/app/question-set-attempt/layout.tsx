"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function QuestionSetAttemptLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isLoading, isAuthenticated]);

  return (<>{children}</>);
}