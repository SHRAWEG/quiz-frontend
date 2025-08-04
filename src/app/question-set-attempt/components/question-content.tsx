"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUESTION_TYPES } from "@/constants/questions";
import { questionTypes } from "@/enums/question-type";
import { QuestionAttempt } from "@/types/question-set-attempt";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderPinwheel,
  Pencil,
  Upload,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface QuestionContentProps {
  questionAttempt: QuestionAttempt;
  questionNumber: number;
  totalQuestions: number;
  answeredQuestions: number;
  selectedValue: string | undefined;
  setSelectedValue: (optionId: string) => void;
  setShowReviewModal: (showReviewModal: boolean) => void;
  onNavigate: (direction: "prev" | "next", selectedValue?: string) => void;
  isPending: boolean;
  setSubmitConfirmation: (isSubmit: boolean) => void;
  submitPending: boolean;
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
  submitPending,
}: QuestionContentProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full">
      <div className="min-w-1/2 max-w-5xl mx-auto p-4">
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            {/* Question Metadata - Improved for mobile */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span className="font-medium">
                  {
                    questionTypes.find(
                      (x) => x.value == questionAttempt.question.type
                    )?.label
                  }
                </span>
                <span>|</span>
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {questionAttempt.question.subject.name}
                </span>
                <span>|</span>
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {questionAttempt.question.subSubject.name}
                </span>
                {questionAttempt.question.difficulty && (
                  <>
                    <span>|</span>
                    <span>
                      Difficulty: {questionAttempt.question.difficulty}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-medium break-words whitespace-normal">
                {questionNumber}. {questionAttempt.question.questionText}
              </h2>
            </div>

            {/* MCQ Options */}
            {questionAttempt.question.type === QUESTION_TYPES.MCQ && (
              <div className="space-y-3">
                {questionAttempt.question.options.map((option, index) => (
                  <Button
                    key={option.id}
                    variant={
                      selectedValue === option.id ? "default" : "outline"
                    }
                    className={`w-full justify-start py-4 sm:py-6 text-left whitespace-normal break-words ${
                      selectedValue === option.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedValue(option.id)}
                  >
                    <span className="text-start">
                      {index + 1}. {option.optionText}
                    </span>
                  </Button>
                ))}
              </div>
            )}

            {/* True/False Options */}
            {questionAttempt.question.type === QUESTION_TYPES.TRUE_FALSE && (
              <div className="space-y-3">
                <Button
                  variant={selectedValue === "true" ? "default" : "outline"}
                  className={`w-full justify-start py-4 sm:py-6 ${
                    selectedValue === "true" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedValue("true")}
                >
                  <span className="font-medium">True</span>
                </Button>
                <Button
                  variant={selectedValue === "false" ? "default" : "outline"}
                  className={`w-full justify-start py-4 sm:py-6 ${
                    selectedValue === "false" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedValue("false")}
                >
                  <span className="font-medium">False</span>
                </Button>
              </div>
            )}

            {/* Fill in the Blanks */}
            {questionAttempt.question.type ===
              QUESTION_TYPES.FILL_IN_THE_BLANKS && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={selectedValue || ""}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full border rounded-md p-2 sm:p-3"
                />
              </div>
            )}

            {/* Long/Short Answer */}
            {(questionAttempt.question.type === QUESTION_TYPES.LONG ||
              questionAttempt.question.type === QUESTION_TYPES.SHORT) && (
              <div className="space-y-3">
                <textarea
                  rows={
                    questionAttempt.question.type === QUESTION_TYPES.SHORT
                      ? 4
                      : 8
                  }
                  value={selectedValue || ""}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full border rounded-md p-2 sm:p-3"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 pb-4 pt-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            disabled={questionNumber === 1}
            onClick={() => onNavigate("prev")}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          <Button
            size="default"
            onClick={() => {
              onNavigate("next", selectedValue);
              if (questionNumber === totalQuestions) {
                setShowReviewModal(true);
              }
            }}
            disabled={isPending}
            className="gap-1"
          >
            {isPending && <LoaderPinwheel className="animate-spin h-4 w-4" />}
            {questionNumber === totalQuestions
              ? "Submit and Review"
              : selectedValue
              ? "Submit & Next"
              : "Next"}
            {questionNumber !== totalQuestions && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Bottom Action Bar */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="flex items-center gap-2 text-sm">
                <Pencil className="h-4 w-4" />
                <span className="text-muted-foreground">
                  Answered: {answeredQuestions}/{totalQuestions}
                </span>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="default"
                  size="default"
                  onClick={() => setShowReviewModal(true)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Review Answers</span>
                </Button>
                <Button
                  variant="default"
                  size="default"
                  onClick={() => setSubmitConfirmation(true)}
                  className="gap-2 bg-green-600 hover:bg-green-500"
                  disabled={submitPending}
                >
                  {submitPending ? (
                    <LoaderPinwheel className="animate-spin h-4 w-4" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>Finish</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
