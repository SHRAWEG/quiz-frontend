"use client"

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import QuestionSetList from "./components/list";
import { Bookmark } from "lucide-react";

export default function ExplorePage() {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bookmark className="h-8 w-8 text-primary" />
              Explore
            </h1>
          </div>

          <Separator />
        </div>

        <QuestionSetList />
      </div>
    </Card>
  );
}