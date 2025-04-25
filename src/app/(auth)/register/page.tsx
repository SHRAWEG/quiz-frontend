"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
  registerReqDto,
  RegisterReqDto
} from "@/types/auth/register.dto";
import { toast } from "sonner";
import { useRegister, useResendVerification } from "@/hooks/api/useAuth";
import { ApiError } from "@/lib/axios";

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useRegister();
  const { mutate: resendVerification, isPending: isResendPending } = useResendVerification();

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<RegisterReqDto>({
    resolver: zodResolver(registerReqDto),
    // defaultValuesRegisterReqDto{
    //   firstName: RegisterResDto,
    //   middleName: "",
    //   lastName: "",
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    //   role: 3,
    // },
    mode: "onBlur",
    criteriaMode: "all",
  });

  useEffect(() => {
    form.reset({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Student",
    });
  }, [form]);

  // Handle form submission
  function onSubmit(data: RegisterReqDto) {
    mutate(data, {
      onSuccess: () => {
        toast.success("Signup successful", {
          description: "You have been registered successfully.",
        });
      },

      onError: (error: ApiError) => {
        if (error.status === 400 && error.data.errors) {
          Object.entries(error.data.errors).forEach(([field, messages]) => {
            form.setError(field as keyof RegisterReqDto, {
              type: "manual",
              message: (messages as string[]).join(", "),
            });
          });
        }

        toast.error("Signup failed", {
          description: error.data.message,
        });
      },
    });
  }

  const handleResendVerification = () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email address to resend verification.");
      return;
    }

    resendVerification({ email }, {
      onSuccess: () => {
        toast.success("Verification email resent successfully.");
      },
      onError: (error: ApiError) => {
        toast.error("Failed to resend verification email", {
          description: error.data.message,
        });
      },
    });
  }

  // Helper function to determine if we should show an error
  const shouldShowError = (fieldName: keyof RegisterReqDto) => {
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
              Registration Successful!
            </CardTitle>
            <CardDescription className="text-center">
              <p>We've sent a verification email to {form.getValues('email')}.</p>
              <p>Please check your inbox and click the verification link.</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6 items-center">
            <div>
              <Button variant="secondary" className="cursor-pointer" onClick={() => router.push('/login')}>Go to Login</Button>
            </div>
            <div className="flex flex-col space-y-2 items-center">
              <p>Didn't receive the email?</p>
              <Button
                variant={"default"}
                className="cursor-pointer"
                onClick={handleResendVerification}
                disabled={isResendPending}
              >
                {isResendPending ? "Resending..." : "Resend Verification Email"}
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
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create a new account
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Role Selection Field */}
            <div className="space-y-3">
              <Label htmlFor="role">What are you?</Label>
              <select
                id="role"
                className={`h-11 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${shouldShowError("role")
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-gray-300 focus-visible:ring-primary"
                  }`}
                {...form.register("role")}
                aria-invalid={!!form.formState.errors.role}
              >
                <option value={"student"}>Student</option>
                <option value={"teacher"}>Teacher</option>
              </select>
              {shouldShowError("role") && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.role?.message}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className={`h-11 ${shouldShowError("firstName")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                    }`}
                  {...form.register("firstName")}
                  aria-invalid={!!form.formState.errors.firstName}
                />
                {shouldShowError("firstName") && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.firstName?.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  placeholder="David"
                  className="h-11"
                  {...form.register("middleName")}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className={`h-11 ${shouldShowError("lastName")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                    }`}
                  {...form.register("lastName")}
                  aria-invalid={!!form.formState.errors.lastName}
                />
                {shouldShowError("lastName") && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.lastName?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className={`h-11 ${shouldShowError("email")
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
                  }`}
                {...form.register("email")}
                aria-invalid={!!form.formState.errors.email}
              />
              {shouldShowError("email") && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.email?.message}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                className={`h-11 ${shouldShowError("phone")
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
                  }`}
                {...form.register("phone")}
                aria-invalid={!!form.formState.errors.phone}
              />
              {shouldShowError("phone") && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.phone?.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 pr-10 ${shouldShowError("password")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                    }`}
                  {...form.register("password")}
                  aria-invalid={!!form.formState.errors.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {shouldShowError("password") && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.password?.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 pr-10 ${shouldShowError("confirmPassword")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                    }`}
                  {...form.register("confirmPassword")}
                  aria-invalid={!!form.formState.errors.confirmPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isPending}
            >
              {isPending
                ? "Creating account..."
                : "Create account"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
