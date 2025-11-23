"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

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
import { loginReqDto, LoginReqDto, LoginResDto } from "@/types/auth/login.dto";
import { toast } from "sonner";
import Link from "next/link";
import { useLogin, useResendVerification } from "@/hooks/api/useAuth";
import { COOKIE_KEYS } from "@/constants/cookie-keys";
import { setCookie, getCookie } from "cookies-next/client";
import { ApiError } from "@/lib/axios";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";

function LoginScreen() {
  const { login, isAuthenticated, token, isLoading } = useAuthContext();

  const { mutate, isPending } = useLogin();
  const { mutate: resendVerify } = useResendVerification();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [resendVerifyLink, setResendVerifyLink] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<LoginReqDto>({
    resolver: zodResolver(loginReqDto),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  // Extract OAuth params from URL
  const searchParams = useSearchParams(); // or useRouter().query
  const oauthParams = useMemo(
    () => ({
      response_type: searchParams.get("response_type"),
      client_id: searchParams.get("client_id"),
      redirect_uri: searchParams.get("redirect_uri"),
      scope: searchParams.get("scope"),
      state: searchParams.get("state"),
    }),
    [searchParams]
  );

  const hasOAuthParams = oauthParams.client_id && oauthParams.redirect_uri;

  // Redirect if user is already logged in and has OAuth params
  useEffect(() => {
    // Wait for auth context to finish loading
    if (isLoading) return;

    if (isAuthenticated && hasOAuthParams) {
      const accessToken =
        token || (getCookie(COOKIE_KEYS.TOKEN) as string | null);
      if (accessToken) {
        setIsRedirecting(true);
        const oauthUrl = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/oauth/authorize-with-token`
        );
        oauthUrl.searchParams.set("token", accessToken);
        Object.entries(oauthParams).forEach(([key, value]) => {
          if (value) oauthUrl.searchParams.set(key, value);
        });

        // Redirect to OAuth endpoint (will redirect to forum)
        window.location.href = oauthUrl.toString();
      }
    }
  }, [isAuthenticated, hasOAuthParams, token, oauthParams, isLoading]);

  function onSubmit(data: LoginReqDto) {
    mutate(data, {
      onSuccess: (data: LoginResDto) => {
        const token = data.accessToken;

        // Step 2: If OAuth flow, complete it
        if (hasOAuthParams) {
          setIsRedirecting(true);
          const oauthUrl = new URL(
            `${process.env.NEXT_PUBLIC_API_URL}/oauth/authorize-with-token`
          );
          oauthUrl.searchParams.set("token", token);
          Object.entries(oauthParams).forEach(([key, value]) => {
            if (value) oauthUrl.searchParams.set(key, value);
          });

          // Redirect to OAuth endpoint (will redirect to forum)
          window.location.href = oauthUrl.toString();
          // Note: You can't set Authorization header with window.location
          // So you need to use authorize-with-token endpoint instead
        } else {
          setCookie(COOKIE_KEYS.TOKEN, data.accessToken, {
            maxAge: 60 * 60 * 24,
            path: "/",
          });
          setCookie(COOKIE_KEYS.EMAIL, data.email, {
            maxAge: 60 * 60 * 24,
            path: "/",
          });
          setCookie(COOKIE_KEYS.NAME, data.name, {
            maxAge: 60 * 60 * 24,
            path: "/",
          });
          setCookie(COOKIE_KEYS.ROLE, data.role, {
            maxAge: 60 * 60 * 24,
            path: "/",
          });

          toast.success("Login  successful", {
            description: "You have been logged in successfully.",
          });

          login(data);
        }
      },
      onError: (error: ApiError) => {
        if (error.status === 401) {
          setError(error.data.message);
        }

        if (error.status === 403) {
          setError(error.data.message);
          setResendVerifyLink(true);
        }
      },
    });
  }

  function handleResendVerification() {
    resendVerify(
      { email: form.getValues("email") },
      {
        onSuccess: () => {
          toast("Verification link sent successfully", {
            description: "Please check your email for the verification link.",
          });
        },
        onError: (error: ApiError) => {
          toast.error("Error sending verification link", {
            description: error.data.message,
          });
        },
      }
    );
  }

  // Helper function to determine if we should show an error
  const shouldShowError = (fieldName: keyof LoginReqDto) => {
    return (
      form.formState.touchedFields[fieldName] &&
      form.formState.errors[fieldName]
    );
  };

  // Show loading overlay when redirecting
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <CardTitle className="text-xl font-semibold">
                Redirecting to Forum
              </CardTitle>
              <CardDescription>
                Please wait while we log you in to the forum...
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Sign in
          </CardTitle>
          <CardDescription>
            Enter your email and password to access your account
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
                  setError("");
                  setResendVerifyLink(false);
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

            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`h-11 pr-10 ${
                  shouldShowError("password")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...form.register("password")}
                onChange={(e) => {
                  form.setValue("password", e.target.value.trim());
                  setError("");
                  setResendVerifyLink(false);
                  form.clearErrors("password");
                }}
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

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            {resendVerifyLink && (
              <a
                onClick={handleResendVerification}
                className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary underline underline-offset-4"
              >
                Resend verify link to your email address.
              </a>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button type="submit" className="w-full h-11" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex items-center justify-center">
              <Link href="/forgot-password">
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs font-normal text-muted-foreground"
                  type="button"
                >
                  Forgot password?
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Create account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <CardTitle className="text-xl font-semibold">
                  Loading...
                </CardTitle>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <LoginScreen />
    </Suspense>
  );
}
