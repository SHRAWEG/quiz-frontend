"use client"

import List from "./components/list"
import { PageHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Page() {
    const router = useRouter()

    return (
        <>
            <PageHeader
                title="Subjects"
                description="Manage your subjects here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Subjects" }
                ]}
                actions={
                    <Button onClick={() => router.push("/subjects/create")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subject
                    </Button>
                }
            />

            <List />
        </>

    )
}