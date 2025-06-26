"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUpdatePayment } from '@/hooks/api/useUserSubscription';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { mutate: updatePayment } = useUpdatePayment();

  useEffect(() => {
    const data = params.get('data');

    if (!data) {
      setError('No payment data received');
      setIsVerifying(false);
      return;
    }

    updatePayment(
      { data: Array.isArray(data) ? data[0] : data },
      {
        onSuccess: () => {
          setTimeout(() => router.push('/dashboard'), 3000);
          setIsVerifying(false);
        },
        onError: (error: Error) => {
          setError(error.message || 'Payment verification failed');
          setIsVerifying(false);
        },
      }
    );
  }, [params, updatePayment, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Alert variant="destructive">
              <AlertCircle className="h-6 w-6" />
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/pricings')}
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="p-6">
          {isVerifying ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <CardTitle>Verifying Payment</CardTitle>
              <p className="text-muted-foreground">
                Please wait while we process your transaction
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle>Payment Successful!</CardTitle>
              <p className="text-muted-foreground">
                Thank you for your payment. Your subscription is now active.
              </p>
              <div className="w-full pt-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to dashboard...
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}