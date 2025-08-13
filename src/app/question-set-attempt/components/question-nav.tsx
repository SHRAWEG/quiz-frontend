"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { QuestionAttempt } from "@/types/question-set-attempt"
import { PanelLeftIcon } from "lucide-react"
import { useState } from "react"

interface QuestionNavigationProps {
  questions: QuestionAttempt[]
  currentQuestionId: string
  onQuestionSelect: (id: string) => void
}

export function QuestionNavigation({
  questions,
  currentQuestionId,
  onQuestionSelect,
}: QuestionNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={cn(
      "sticky min-h-screen h-full border-r bg-background transition-all p-2",
      isCollapsed ? "w-16" : "w-full max-w-1/3",
    )}>
      <div>
        {/* Collapse/Expand Button */}
        <Button
          variant="ghost"
          size="icon"
          className="border rounded-full w-8 h-8 bg-background"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <PanelLeftIcon className="h-4 w-4" />
          {/* {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />} */}
        </Button>
      </div>

      {!isCollapsed ? (
        <ScrollArea className="h-[calc(100vh-120px)]"> {/* Adjusted height */}
          <div className="flex flex-col gap-2 p-3">
            {questions.map((questionAttempt, index) => {
              const isAnswered = questionAttempt.selectedBooleanAnswer != null || questionAttempt.selectedOptionId || questionAttempt.selectedTextAnswer
              return (
                <div key={questionAttempt.id} className="">
                  <Button
                    variant={questionAttempt.id === currentQuestionId ? "default" : "outline"}
                    className={`w-full h-auto min-h-10 justify-start text-left whitespace-normal ${isAnswered && "ring-1 ring-green-400"}`}
                    onClick={() => onQuestionSelect(questionAttempt.id)}
                  >
                    <span className="font-medium mr-2">{index + 1}.</span>
                    {questionAttempt.question.questionText}
                  </Button>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      ) : (
        /* Collapsed State */
        <div className="flex flex-col items-center pt-4 gap-2">
          {questions.slice(0, 8).map((q, i) => {
            const isAnswered = q.selectedBooleanAnswer !== null || q.selectedOptionId || q.selectedTextAnswer
            return (
              <Button
                key={q.id}
                variant={
                  q.id === currentQuestionId ? "default" : "outline"
                }
                size="icon"
                className={`w-10 h-10 ${isAnswered && "ring-1 ring-green-400"}`}
                onClick={() => onQuestionSelect(q.id)}
              >
                {i + 1}
              </Button>
            )
          })}
          {questions.length > 8 && (
            <span className="text-xs text-muted-foreground">
              +{questions.length - 8}
            </span>
          )}
        </div>
      )}
    </aside>
  )
}