"use client"

import { CreditCard, ArrowRight, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCancelCredit, useGetBalance, useInitiateCredit } from "@/hooks/api/useCredit";
import { toast } from "sonner";

export default function PurchaseCreditsPage() {
  const [credits, setCredits] = useState<number>(100);
  const [step, setStep] = useState<"input" | "summary">("input");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [transactionUuid, setTransactionUuid] = useState<string>("");
  const [productCode, setProductCode] = useState<string>("");
  const [signature, setSignature] = useState<string>("");

  const { data: balance } = useGetBalance();
  const { mutate: initiateCredit, isPending: isInititatePending } = useInitiateCredit();
  const { mutate: cancelCredit, isPending: isCancelPending } = useCancelCredit();

  const handleInitiate = async () => {
    initiateCredit({ credits }, {
      onSuccess: (data) => {
        setTotalAmount(data.data.totalAmount);
        setTransactionUuid(data.data.transactionUuid);
        setProductCode(data.data.productCode);
        setSignature(data.data.signature)

        setStep("summary");

      },
      onError: (error) => {
        toast.error(error.data.message);
      }
    })
  };

  const handleCancel = async () => {
    cancelCredit({ transactionUuid }, {
      onSuccess: () => {
        setStep("input");
      },
      onError: (error) => {
        toast.error(error.data.message)
      }
    })
  }

  const handlePayment = () => {
    // Redirect to eSewa
    // Create a temporary form element
    const tempForm = document.createElement('form');
    tempForm.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    tempForm.method = "POST";
    tempForm.style.display = 'none';

    // Add all required fields
    const fields = {
      amount: totalAmount,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: process.env.NEXT_PUBLIC_ESEWA_CREDIT_SUCCESS_URL,
      failure_url: process.env.NEXT_PUBLIC_ESEWA_CREDIT_FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature
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
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Credit Top-Up</h1>
      </div>

      {step === "input" ? (
        <Card>
          <CardHeader>
            <CardTitle>Add Credits</CardTitle>
            <p className="text-sm text-muted-foreground">
              1 Credit = 1 NPR
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="credits">Credit Amount</Label>
                <Input
                  id="credits"
                  type="number"
                  min="100"
                  step="100"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  placeholder="Enter credit amount"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 100 credits
                </p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Current Balance:</span>
                  <span className="font-medium">{balance} credits</span>
                </div>
                <div className="flex justify-between">
                  <span>New Balance:</span>
                  <span className="font-medium">{(balance ?? 0) + credits} credits</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleInitiate}
                disabled={credits < 100 || isInititatePending}
              >
                {isInititatePending ? "Processing..." : "Continue to Payment"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              Review your purchase before payment
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Credit Amount:</span>
                  <span>{credits} credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span>1 NPR/credit</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>{credits} NPR</span>
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">New Balance After Purchase</span>
                </div>
                <div className="text-center text-2xl font-bold py-2">
                  {(balance ?? 0) + credits} credits
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handlePayment}
                >
                  Pay with eSewa
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleCancel()}
                  disabled={isCancelPending}
                >
                  Back to Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}