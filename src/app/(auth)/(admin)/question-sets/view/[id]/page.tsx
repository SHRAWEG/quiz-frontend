"use client";

import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import QuestionSetDetail from "../../components/question-set-detail";

export default function ViewPage() {
  const router = useRouter()

  return (
    <Card className="p-4">
      <PageHeader
        title="Question Set Detail"
        description="View your question set details here"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Question-Sets", href: "/question-sets" },
          { label: "Question Set Detail" },
        ]}
        actions={
          <Button onClick={() => router.push("/question-sets")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <QuestionSetDetail />
    </Card>
  );
}