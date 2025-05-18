"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QUESTION_TYPES } from "@/constants/questions"
import { questionTypes } from "@/enums/questions"
import { QuestionAttempt } from "@/types/question-set-attempt"
import { ChevronLeft, ChevronRight, LoaderPinwheel, Pencil, Upload } from "lucide-react"

interface QuestionContentProps {
  question: QuestionAttempt
  questionNumber: number
  totalQuestions: number
  answeredQuestions: number
  selectedValue: string | undefined
  setSelectedValue: (optionId: string) => void
  onNavigate: (direction: "prev" | "next", selectedValue?: string) => void
  isPending: boolean
  onSubmit: () => void
  submitPending: boolean
}

export function QuestionContent({
  question,
  questionNumber,
  totalQuestions,
  answeredQuestions,
  selectedValue,
  setSelectedValue,
  onNavigate,
  isPending,
  onSubmit,
  submitPending
}: QuestionContentProps) {
  return (
    <div className="w-full overflow-y-auto">
      {/* Question Card */}
      <div className="min-w-1/2 max-w-5xl mx-auto mt-8">
        <Card className="mb-8">
          <CardContent>
            <div className="flex flex-col justify-between items-start mb-6">
              {/*Question Type Subject -> Sub-Subject */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-muted-foreground">{questionTypes.find(x => x.value == question.type)?.label}</span>|
                <span className="text-sm font-medium text-muted-foreground">{question.subject.name} - {question.subSubject.name}</span>|
                {question.difficulty && (
                  <span className="text-sm font-medium text-muted-foreground">
                    Difficulty: {question.difficulty}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-medium">{questionNumber}. {question.question}</h2>
            </div>

            {/* mcq question options */}
            {question.type === QUESTION_TYPES.MCQ && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={option.id}
                    variant={selectedValue === option.id ? "default" : "outline"}
                    className={`w-full justify-start py-6 ${selectedValue === option.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedValue(option.id)}
                  >
                    <span className="mr-2 font-medium">{index + 1}.</span>
                    {option.option}
                  </Button>
                ))}
              </div>
            )}

            {/* True or False question */}
            {question.type === QUESTION_TYPES.TRUE_FALSE && (
              <div className="space-y-3">
                <Button
                  variant={selectedValue === "true" ? "default" : "outline"}
                  className={`w-full justify-start py-6 ${selectedValue === "true" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedValue("true")}
                >
                  <span className="mr-2 font-medium">True</span>
                </Button>
                <Button
                  variant={selectedValue === "false" ? "default" : "outline"}
                  className={`w-full justify-start py-6 ${selectedValue === "false" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedValue("false")}
                >
                  <span className="mr-2 font-medium">False</span>
                </Button>
              </div>
            )}

            {/* Fill in the Blanks question */}
            {question.type === QUESTION_TYPES.FILL_IN_THE_BLANKS && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={selectedValue || ""}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full border rounded-md p-2"
                />
              </div>
            )}

            {/* Flag question */}
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex justify-between gap-4 pb-4 pt-2">
          <Button
            variant="outline"
            disabled={questionNumber === 1}
            onClick={() => onNavigate("prev")}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={() => onNavigate("next", selectedValue)}
            disabled={isPending}
            className="gap-1"
          >
            {isPending && <LoaderPinwheel className="animate-spin" />} {questionNumber === totalQuestions ? "Submit Answer" : selectedValue ? "Submit & Next" : "Next"}
            {questionNumber !== totalQuestions && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Card for final submit button with total questions and answered questions informations */}
        <Card className="mt-8">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Pencil />
                <span className="text-sm font-medium text-muted-foreground">{answeredQuestions} 10 of {totalQuestions} Questions Attempted </span>
              </div>
              <Button
                variant="default"
                onClick={onSubmit}
                disabled={submitPending}
                className="gap-2 bg-green-600"
              >
                {submitPending ? <LoaderPinwheel className="animate-spin" /> : <Upload /> } Finish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}