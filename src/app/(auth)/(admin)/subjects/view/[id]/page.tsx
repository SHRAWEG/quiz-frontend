"use client";

import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SubjectDetailPage from "../../components/detail";

export default function ViewPage() {
  const router = useRouter()

  return (
    <Card className="p-4">
      <PageHeader
        title="Subject Detail"
        description="View your subject details here"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Subjects", href: "/subjects" },
          { label: "Subject Detail" },
        ]}
        actions={
          <Button onClick={() => router.push("/subjects")} variant="default">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <SubjectDetailPage />

    </Card>
  );
}