"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUpdatePayment } from '@/hooks/api/useUserSubscription';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

export default function FailurePage() {
  const router = useRouter();
  const params = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const { mutate: updatePayment } = useUpdatePayment();

  useEffect(() => {
    const data = params.get('data');

    if (!data) {
      setIsVerifying(false);
      return;
    }

    // Call the same verification API as success page
    updatePayment(
      { data: Array.isArray(data) ? data[0] : data },
      {
        onSettled: () => {
          setIsVerifying(false);
        },
        // We don't need to handle success case since we're on failure page
        // We also don't show specific errors to user
      }
    );
  }, [params, updatePayment]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
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
              <div className="rounded-full bg-red-100 p-4">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle>Payment Failed</CardTitle>
              <p className="text-muted-foreground">
                We couldn't process your payment. Please try again.
              </p>
              <Button
                onClick={() => router.push('/pricings')}
                className="w-full mt-4"
              >
                Back to Pricing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}