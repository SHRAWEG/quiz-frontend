// components/question-set/navigation.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { QuestionAttempt } from "@/types/question-set-attempt";
import { X } from "lucide-react";

interface QuestionSetNavigationProps {
  questions: QuestionAttempt[];
  currentQuestionId: string;
  onQuestionSelect: (id: string) => void;
  isOpen: boolean;
}

export function QuestionSetNavigation({
  questions,
  currentQuestionId,
  onQuestionSelect,
  isOpen,
}: QuestionSetNavigationProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => onQuestionSelect(currentQuestionId)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-65px)] border-r bg-background z-50",
          "w-[400px] min-w-[400px] transition-all duration-300", // Increased width from 300px to 350px
          isOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full lg:translate-x-0 lg:w-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b h-[65px]">
          <h3 className="font-semibold text-lg">Questions</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuestionSelect(currentQuestionId)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-65px)]">
          <div className="flex flex-col gap-2 p-4">
            {questions.map((question, index) => {
              const isAnswered =
                question.selectedBooleanAnswer != null ||
                question.selectedOptionId ||
                question.selectedTextAnswer;
              const isCurrent = question.id === currentQuestionId;

              return (
                <Button
                  key={question.id}
                  variant={isCurrent ? "default" : "outline"}
                  className={cn(
                    "w-full h-auto min-h-16 justify-start text-left",
                    "whitespace-normal break-words text-wrap",
                    "py-3 px-4 text-sm",
                    isAnswered && !isCurrent && "ring-1 ring-green-500",
                    "transition-colors duration-150"
                  )}
                  onClick={() => onQuestionSelect(question.id)}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="font-medium">Question {index + 1}</span>
                    <span className="text-left line-clamp-2">
                      {question.question.questionText}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
