// app/subscription/page.tsx
"use client";

import { useState } from 'react';
import { ShoppingBasket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetActiveSubscriptionPlans } from '@/hooks/api/useSubscriptionPlan';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const { data: subscriptionPlans } = useGetActiveSubscriptionPlans();

  return (
    <Card className="p-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your learning journey. All plans include our core features with additional benefits as you upgrade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {subscriptionPlans?.data.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""
              }`}
          >
            <CardHeader className="pb-4 h-24">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardHeader>

            <Separator className="my-4" />

            <CardContent className="pb-6">
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    NPR {plan.price}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                variant={selectedPlan === plan.id ? "default" : "outline"}
                onClick={() => setSelectedPlan(plan.id)}
              >
                Select
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <CardFooter className="mt-8 justify-end">
        {/* Payment Button */}
        <Button
          variant="default"
          disabled={!selectedPlan}
          onClick={() => {
            if (selectedPlan) {
              router.push(`payment/${selectedPlan}`)
            }
          }}
        >
          <ShoppingBasket className="mr-2" />
          Proceed to checkout
        </Button>
      </CardFooter>
    </Card >
  );
}