"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPasswordReqDto,
  ResetPasswordReqDto,
} from "@/types/auth/forgot-password.dto";
import { toast } from "sonner";
import { useResetPassword } from "@/hooks/api/useAuth";
import { ApiError } from "@/lib/axios";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending, isSuccess } = useResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm<ResetPasswordReqDto>({
    resolver: zodResolver(resetPasswordReqDto),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      toast.error("Invalid or missing reset token");
      router.push("/forgot-password");
      return;
    }
    setToken(tokenFromUrl);
    form.setValue("token", tokenFromUrl);
  }, [searchParams, router, form]);

  const onSubmit = (data: ResetPasswordReqDto) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Password reset successful", {
          description:
            "Your password has been updated. You can now sign in with your new password.",
        });
      },
      onError: (error: ApiError) => {
        toast.error("Error resetting password", {
          description:
            error.data.message ||
            "Please try again or request a new reset link.",
        });
      },
    });
  };

  // Helper function to determine if we should show an error
  const shouldShowError = (fieldName: keyof ResetPasswordReqDto) => {
    return (
      form.formState.touchedFields[fieldName] &&
      form.formState.errors[fieldName]
    );
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Password Reset Successful!
            </CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully updated. You can now sign in
              with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6 items-center">
            <Button
              variant="default"
              className="w-full cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            Need help? Contact support.
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-center">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6 items-center">
            <Button
              variant="default"
              className="w-full cursor-pointer"
              onClick={() => router.push("/forgot-password")}
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex items-center space-x-2">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Reset Password
            </CardTitle>
          </div>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className={`h-11 pr-10 ${
                    shouldShowError("newPassword")
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...form.register("newPassword")}
                  onChange={(e) => {
                    form.setValue("newPassword", e.target.value);
                    form.clearErrors("newPassword");
                  }}
                  aria-invalid={!!form.formState.errors.newPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {shouldShowError("newPassword") && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.newPassword?.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className={`h-11 pr-10 ${
                    shouldShowError("confirmPassword")
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...form.register("confirmPassword")}
                  onChange={(e) => {
                    form.setValue("confirmPassword", e.target.value);
                    form.clearErrors("confirmPassword");
                  }}
                  aria-invalid={!!form.formState.errors.confirmPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {shouldShowError("confirmPassword") && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.confirmPassword?.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isPending}>
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ResetPasswordScreen() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
