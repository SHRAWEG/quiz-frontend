"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Lock, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  changePasswordReqDto, 
  ChangePasswordReqDto 
} from "@/types/auth/change-password.dto";
import { useChangePassword } from "@/hooks/api/useAuth";
import { ApiError } from "@/lib/axios";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ChangePasswordForm({ 
  onSuccess, 
  className 
}: ChangePasswordFormProps) {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const form = useForm<ChangePasswordReqDto>({
    resolver: zodResolver(changePasswordReqDto),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const onSubmit = (data: ChangePasswordReqDto) => {
    changePassword(data, {
      onSuccess: () => {
        toast.success("Password changed successfully", {
          description: "Your password has been updated.",
          icon: <CheckCircle className="h-4 w-4" />,
        });
        form.reset();
        onSuccess?.();
      },
      onError: (error: ApiError) => {
        if (error.status === 400) {
          toast.error("Password change failed", {
            description: error.data.message || "Please check your current password and try again.",
          });
        } else if (error.status === 401) {
          toast.error("Authentication failed", {
            description: "Your current password is incorrect.",
          });
        } else {
          toast.error("Something went wrong", {
            description: "Please try again later.",
          });
        }
      },
    });
  };

  // Helper function to determine if we should show an error
  const shouldShowError = (fieldName: keyof ChangePasswordReqDto) => {
    return (
      form.formState.touchedFields[fieldName] &&
      form.formState.errors[fieldName]
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Change Password</CardTitle>
        </div>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showPasswords.oldPassword ? "text" : "password"}
                placeholder="Enter your current password"
                className={`pr-10 ${
                  shouldShowError("oldPassword")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...form.register("oldPassword")}
                aria-invalid={!!form.formState.errors.oldPassword}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 text-muted-foreground"
                onClick={() => togglePasswordVisibility("oldPassword")}
              >
                {showPasswords.oldPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {shouldShowError("oldPassword") && (
              <p className="text-sm text-destructive">
                {form.formState.errors.oldPassword?.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.newPassword ? "text" : "password"}
                placeholder="Enter your new password"
                className={`pr-10 ${
                  shouldShowError("newPassword")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...form.register("newPassword")}
                aria-invalid={!!form.formState.errors.newPassword}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 text-muted-foreground"
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                {showPasswords.newPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {shouldShowError("newPassword") && (
              <p className="text-sm text-destructive">
                {form.formState.errors.newPassword?.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showPasswords.confirmNewPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                className={`pr-10 ${
                  shouldShowError("confirmNewPassword")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...form.register("confirmNewPassword")}
                aria-invalid={!!form.formState.errors.confirmNewPassword}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 text-muted-foreground"
                onClick={() => togglePasswordVisibility("confirmNewPassword")}
              >
                {showPasswords.confirmNewPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {shouldShowError("confirmNewPassword") && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmNewPassword?.message}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium mb-2">Password Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains at least one uppercase letter</li>
              <li>• Contains at least one lowercase letter</li>
              <li>• Contains at least one number</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
              className="flex-1"
            >
              {isPending ? "Updating Password..." : "Update Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
