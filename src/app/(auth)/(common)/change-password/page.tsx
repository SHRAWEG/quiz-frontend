"use client";

import { ChangePasswordForm } from "@/components/shared/change-password-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSuccess = () => {
    // Optionally redirect to profile or dashboard after successful password change
    router.push("/profile");
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Change Password</h1>
        <p className="text-muted-foreground mt-2">
          Update your password to keep your account secure
        </p>
      </div>

      <ChangePasswordForm 
        onSuccess={handleSuccess}
        className="w-full"
      />
    </div>
  );
}
