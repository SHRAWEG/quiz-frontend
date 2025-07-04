"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QUESTION_TYPES } from "@/constants/questions"
import { questionTypes } from "@/enums/question-type"
import { QuestionAttempt } from "@/types/question-set-attempt"
import { ChevronLeft, ChevronRight, Eye, LoaderPinwheel, Pencil, Upload } from "lucide-react"

interface QuestionContentProps {
  questionAttempt: QuestionAttempt
  questionNumber: number
  totalQuestions: number
  answeredQuestions: number
  selectedValue: string | undefined
  setSelectedValue: (optionId: string) => void
  setShowReviewModal: (showReviewModal: boolean) => void
  onNavigate: (direction: "prev" | "next", selectedValue?: string) => void
  isPending: boolean
  setSubmitConfirmation: (isSubmit: boolean) => void
  submitPending: boolean
}

export function QuestionContent({
  questionAttempt,
  questionNumber,
  totalQuestions,
  answeredQuestions,
  selectedValue,
  setSelectedValue,
  setShowReviewModal,
  onNavigate,
  isPending,
  setSubmitConfirmation,
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
                <span className="text-sm font-medium text-muted-foreground">{questionTypes.find(x => x.value == questionAttempt.question.type)?.label}</span>|
                <span className="text-sm font-medium text-muted-foreground">{questionAttempt.question.subject.name} - {questionAttempt.question.subSubject.name}</span>|
                {questionAttempt.question.difficulty && (
                  <span className="text-sm font-medium text-muted-foreground">
                    Difficulty: {questionAttempt.question.difficulty}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-medium">{questionNumber}. {questionAttempt.question.questionText}</h2>
            </div>

            {/* mcq questionAttempt options */}
            {questionAttempt.question.type === QUESTION_TYPES.MCQ && (
              <div className="space-y-3">
                {questionAttempt.question.options.map((option, index) => (
                  <Button
                    key={option.id}
                    variant={selectedValue === option.id ? "default" : "outline"}
                    className={`w-full justify-start py-6 ${selectedValue === option.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedValue(option.id)}
                  >
                    <span className="mr-2 font-medium">{index + 1}.</span>
                    {option.optionText}
                  </Button>
                ))}
              </div>
            )}

            {/* True or False questionAttempt */}
            {questionAttempt.question.type === QUESTION_TYPES.TRUE_FALSE && (
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

            {/* Fill in the Blanks questionAttempt */}
            {questionAttempt.question.type === QUESTION_TYPES.FILL_IN_THE_BLANKS && (
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

            {/* Long and Short questionAttempt */}
            {(questionAttempt.question.type === QUESTION_TYPES.LONG || questionAttempt.question.type === QUESTION_TYPES.SHORT) && (
              <div className="space-y-3">
                <textarea
                  rows={questionAttempt.question.type === QUESTION_TYPES.SHORT ? 4 : 16}
                  value={selectedValue || ""}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full border rounded-md p-2"
                />
              </div>
            )}

            {/* Flag questionAttempt */}
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
                <span className="text-sm font-medium text-muted-foreground">{answeredQuestions} of {totalQuestions} Questions Answered </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={() => setShowReviewModal(true)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Review Answers
                </Button>
                <Button
                  variant="default"
                  onClick={() => setSubmitConfirmation(true)}
                  className="gap-2 bg-green-600 hover:bg-green-500"
                  disabled={submitPending}
                >
                  {submitPending ? <LoaderPinwheel className="animate-spin" /> : <Upload />} Finish
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}