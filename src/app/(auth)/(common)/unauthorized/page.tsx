"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuthContext();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-600">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-gray-500">
              Current role:{" "}
              <span className="font-medium capitalize">
                {user?.role || "Unknown"}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleGoHome} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>

              <Button
                variant="outline"
                onClick={handleGoBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
