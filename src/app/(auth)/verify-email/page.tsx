"use client";

import { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/lib/axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid or missing token.");
      router.push("/login"); // Redirect to login if no token is present
    }
  }, [searchParams, router]);

  const handleVerify = async () => {
    setIsSubmitting(true);

    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    try 
    {
        const response = await instance.get("/auth/verify-email", { params: { token } });
        toast.success("Email verified successfully!");
        setIsSubmitting(false);
        router.push("/login");
      } catch (error) {
        setIsSubmitting(false);
        console.error('Verification failed:', error);
      }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center">
            Click the button below to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleVerify}
            disabled={isSubmitting}
            className="w-full h-11"
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Need help? Contact support.
        </CardFooter>
      </Card>
    </div>
  );
}