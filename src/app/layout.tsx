"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
