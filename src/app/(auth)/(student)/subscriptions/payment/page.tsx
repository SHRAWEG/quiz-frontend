"use client";

import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

import CryptoJS from "crypto-js";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function generateHmacBase64(message: string, secret: string): string {
  const hash = CryptoJS.HmacSHA256(message, secret);
  return CryptoJS.enc.Base64.stringify(hash);
}
export default function PaymentPage() {
  const transaction_uuid = uuidv4();
  const total_amount = "110";
  const secret = "8gBm/:&EnhH.1/q"
  const product_code = "EPAYTEST";
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  let signature = generateHmacBase64(message, secret);

  console.log("message:", message);

  console.log("Generated Signature:", signature);

  const formData = {
    amount: "100",
    tax_amount: "10",
    total_amount: "110",
    transaction_uuid: "241028",
    product_code: "EPAYTEST",
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: "https://developer.esewa.com.np/success",
    failure_url: "https://developer.esewa.com.np/failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signature
  }

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
        <input type="hidden" name="amount" value="100" />
        <input type="hidden" name="tax_amount" value="10" />
        <input type="hidden" name="total_amount" value="110" />
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