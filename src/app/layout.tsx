"use client";

import { Inter } from "next/font/google";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import { Toaster } from "sonner";

const font = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

// export const metadata: Metadata = {
//   title: "Quiz",
//   description: "Take a quick quiz",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body
        className={`${font.className}`}
      >
        <Toaster position="top-right" richColors />
        <QueryClientProvider client={queryClient}>
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
