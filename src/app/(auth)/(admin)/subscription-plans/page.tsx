"use client"

import List from "./components/list"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Page() {
    const router = useRouter()

    return (
        <Card className="p-4">
            <PageHeader
                title="Subscription Plans"
                description="Manage your subscription plans here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Subscription Plans" }
                ]}
                actions={
                    <Button onClick={() => router.push("/subscription-plans/create")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subscription Plan
                    </Button>
                }
            />
            <List />
        </Card>
    )
}