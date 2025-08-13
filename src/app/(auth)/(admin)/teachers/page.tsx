"use client"

import List from "./components/list"
import { PageHeader } from "@/components/ui/page-header"
import { Card } from "@/components/ui/card"

export default function Page() {

    return (
        <Card className="p-4">
            <PageHeader
                title="Teachers"
                description="Teachers List"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Teachers" }
                ]}
            />
            <List />
        </Card>
    )
}