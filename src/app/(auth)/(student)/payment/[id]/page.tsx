// app/subscription/checkout/[id]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { ShoppingBasket, ArrowLeft, Check, BadgeInfo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetSubscriptionPlanDetail } from '@/hooks/api/useSubscriptionPlan';
import Image from 'next/image';
import Link from 'next/link';
import FullPageLoader from '@/components/ui/full-page-loader';
import { useCheckout } from '@/hooks/api/useUserSubscription';

export default function CheckoutPage() {
  const { id } = useParams();
  const { data: plan, isLoading, error } = useGetSubscriptionPlanDetail(id as string);
  const checkout = useCheckout();

  const handlePayment = async () => {
    try {
      const response = await checkout.mutateAsync({ subscriptionPlanId: id as string });

      // Create a temporary form element
      const tempForm = document.createElement('form');
      tempForm.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      tempForm.method = "POST";
      tempForm.style.display = 'none';

      // Add all required fields
      const fields = {
        amount: plan?.price,
        tax_amount: "0",
        total_amount: response.data.totalAmount,
        transaction_uuid: response.data.transactionUuid,
        product_code: response.data.productCode,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "http://localhost:3000/payment/success",
        failure_url: "http://localhost:3000/payment/failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: response.data.signature
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value?.toString() ?? "";
        tempForm.appendChild(input);
      });

      // Append to body and submit
      document.body.appendChild(tempForm);
      tempForm.submit();

    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FullPageLoader />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 text-center">
        <BadgeInfo className="h-12 w-12 text-rose-500" />
        <h2 className="text-2xl font-bold">Plan Not Available</h2>
        <p className="text-muted-foreground max-w-md">
          The subscription plan you're looking for isn't available right now.
        </p>
        <Link href="/pricings">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Available Plans
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8">
        <Link href="/pricings">
          <Button variant="default" className="px-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all plans
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">Confirm Your {plan.name} Plan</h1>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Plan Price</span>
                  <span className="text-lg">NPR {plan.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features List */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Unlimited test access',
                'Exclusive content'
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Payment Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Payment</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Image
                src="/images/esewa_og.png"
                alt="eSewa"
                height={200}
                width={400}
                priority
                style={{
                  width: '50%',  // or your desired width
                  height: 'auto', // maintains aspect ratio
                }}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>NPR {plan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>NPR 0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>NPR {plan.price}</span>
              </div>
            </div>

            <Button
              className='w-full'
              onClick={handlePayment}
            >
              <ShoppingBasket />
              Complete Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}