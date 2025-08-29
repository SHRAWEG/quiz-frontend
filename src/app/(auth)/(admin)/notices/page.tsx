"use client";

import List from "./components/list";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Card className="p-4">
      <PageHeader
        title="Notices"
        description="Manage your notices here"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Notices" }]}
        actions={
          <Button onClick={() => router.push("/notices/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Notice
          </Button>
        }
      />
      <List />
    </Card>
  );
}
