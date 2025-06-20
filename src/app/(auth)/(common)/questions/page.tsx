// app/dashboard/page.tsx
'use client'

import { Card } from "@/components/ui/card"
import QuestionsList from "./components/list"
import { PageHeader } from "@/components/layout/app-header"
import { useAuthContext } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"

export default function QuestionPage() {
  const { user } = useAuthContext();
  const router = useRouter()

  return (
    <Card className="p-4">
      <PageHeader
        title="Questions"
        description="Manage your questions here"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Questions" }
        ]}
        actions={
          user?.role === "teacher" && (
            <>
              <Button onClick={() => router.push("/questions/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
              <Button onClick={() => router.push("/questions/upload")} variant="default" className="ml-2">
                <Upload className="mr-2 h-4 w-4" />
                Import Questions
              </Button>
            </>
          )}
      />
      <QuestionsList />
    </Card>
  )
}