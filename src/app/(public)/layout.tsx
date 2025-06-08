"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function QuestionSetAttemptLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isAuthenticated) {
    redirect('/dashboard');
  }

  useEffect(() => {
    if (isLoading) return;
  }, [isLoading]);

  return (<>{children}</>);
}