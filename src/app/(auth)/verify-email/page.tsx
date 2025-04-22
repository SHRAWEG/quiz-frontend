"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid or missing token.");
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleVerify = async () => {
    setIsSubmitting(true);
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid or missing token.");
      setIsSubmitting(false);
      return;
    }

    try {
      await apiClient.get("/auth/verify-email", { params: { token } });
      toast.success("Email verified successfully!");
      setVerificationStatus("success");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed. Please try again.");
      setVerificationStatus("error");
      console.error('Verification failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            {verificationStatus === "success" ? "Email Verified!" : "Verify Your Email"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "success"
              ? "Your email has been successfully verified. Redirecting to login..."
              : "Click the button below to verify your email address."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationStatus === "idle" && (
            <Button
              onClick={handleVerify}
              disabled={isSubmitting}
              className="w-full h-11"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          )}
          {verificationStatus === "success" && (
            <div className="flex justify-center">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Need help? Contact support.
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Verifying Your Email
            </CardTitle>
            <CardDescription className="text-center">
              Please wait while we process your request...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}