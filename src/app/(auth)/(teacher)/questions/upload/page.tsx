"use client";

import { Card } from "@/components/ui/card";
import { UploadQuestion } from "../components/upload-question";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();

  return (
    <Card className="p-4">
      <PageHeader
        title="Upload Questions"
        description="Upload your questions here"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Questions", href: "/questions" },
          { label: "Upload" }
        ]}
        actions={
          (
            <Button onClick={() => router.push("/questions")}>
              <ChevronLeft /> Back
            </Button>
          )
        }
      />

      <UploadQuestion />
    </Card >
  );
}