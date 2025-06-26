"use client";

import { v4 as uuidv4 } from 'uuid';

import CryptoJS from "crypto-js";
import { useEffect, useRef, useState } from "react";
import { useParams } from 'next/navigation';
import { useGetSubscriptionPlanDetail } from '@/hooks/api/useSubscriptionPlan';

function generateHmacBase64(message: string, secret: string): string {
  const hash = CryptoJS.HmacSHA256(message, secret);
  return CryptoJS.enc.Base64.stringify(hash);
}
export default function PaymentPage() {
  const params = useParams();
  const subscriptionPlanId = params.id as string

  const { data: subscriptionPlan, isLoading } = useGetSubscriptionPlanDetail(subscriptionPlanId);

  const transaction_uuid = "130c4e80-7c9a-49ce-9a35-7d11d5cd2b76";
  const total_amount = "110";
  const secret = "8gBm/:&EnhH.1/q"
  const product_code = "EPAYTEST";
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  let signature = "4NQdZTtOLAK/ZXOxMhQAfMsgtdikwtArBPqXH4NASvM=";

  console.log("message:", message);

  console.log("Generated Signature:", signature);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    // You can generate UUID and signature dynamically here before submitting
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <div>
      <h1>Pay with eSewa</h1>
      <form
        ref={formRef}
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
      >
        <input type="hidden" name="amount" value="1000" />
        <input type="hidden" name="tax_amount" value="0" />
        <input type="hidden" name="total_amount" value="1000.00" />
        <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
        <input type="hidden" name="product_code" value="EPAYTEST" />
        <input type="hidden" name="product_service_charge" value="0" />
        <input type="hidden" name="product_delivery_charge" value="0" />
        <input type="hidden" name="success_url" value="http://localhost:3000/payment/success" />
        <input type="hidden" name="failure_url" value="http://localhost:3000/payment/failure" />
        <input
          type="hidden"
          name="signed_field_names"
          value="total_amount,transaction_uuid,product_code"
        />
        <input
          type="hidden"
          name="signature"
          value={signature}
        />
        <button type="button" onClick={handleSubmit}>Pay Now</button>
      </form>
    </div>
  );
}