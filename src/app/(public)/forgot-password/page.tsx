"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
  forgotPasswordReqDto,
  ForgotPasswordReqDto,
} from "@/types/auth/forgot-password.dto";
import { toast } from "sonner";
import { useForgotPassword } from "@/hooks/api/useAuth";
import { ApiError } from "@/lib/axios";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const form = useForm<ForgotPasswordReqDto>({
    resolver: zodResolver(forgotPasswordReqDto),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  const onSubmit = (data: ForgotPasswordReqDto) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Password reset email sent", {
          description: "Please check your email for the password reset link.",
        });
      },
      onError: (error: ApiError) => {
        toast.error("Error sending password reset email", {
          description: error.data.message || "Please try again later.",
        });
      },
    });
  };

  // Helper function to determine if we should show an error
  const shouldShowError = (fieldName: keyof ForgotPasswordReqDto) => {
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
              Email Sent!
            </CardTitle>
            <CardDescription className="text-center">
              <p>
                We've sent a password reset link to {form.getValues("email")}.
              </p>
              <p>
                Please check your inbox and click the link to reset your
                password.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6 items-center">
            <div>
              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Back to Login
              </Button>
            </div>
            <div className="flex flex-col space-y-2 items-center">
              <p>Didn't receive the email?</p>
              <Button
                variant={"default"}
                className="cursor-pointer"
                onClick={() => onSubmit(form.getValues())}
                disabled={isPending}
              >
                {isPending ? "Resending..." : "Resend Reset Email"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            Need help? Contact support.
          </CardFooter>
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
              Forgot Password
            </CardTitle>
          </div>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`h-11 ${
                  shouldShowError("email")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...form.register("email")}
                onChange={(e) => {
                  form.setValue("email", e.target.value.trim());
                  form.clearErrors("email");
                }}
                aria-invalid={!!form.formState.errors.email}
              />
              {shouldShowError("email") && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.email?.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
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
