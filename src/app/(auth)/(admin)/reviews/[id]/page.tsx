"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { useGetQuestionSetAttemptToReview, useMarkQuestion, useMarkQuestionSet } from "@/hooks/api/useQuestionSetAttempt"
import { ChevronLeft, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { QUESTION_TYPES } from "@/constants/questions"
import { formatISODate } from "@/lib/format-date"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ApiError } from "@/lib/axios"
import { MarkReqDto } from "@/types/question-set-attempt"

export default function AttemptReviewPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: attempt, isLoading, refetch } = useGetQuestionSetAttemptToReview(id as string)
  const { mutate: markQuestionAttempt } = useMarkQuestion();
  const { mutate: markQuestionSetAttempt } = useMarkQuestionSet();
  const [isSaving, setIsSaving] = useState(false)
  const [reviewStatus, setReviewStatus] = useState<Record<string, boolean>>({})

  // Initialize review status when data loads
  useEffect(() => {
    if (attempt) {
      const initialStatus = attempt.questionAttempts.reduce((acc, qa) => {
        acc[qa.id] = qa.isCorrect
        return acc
      }, {} as Record<string, boolean>)
      setReviewStatus(initialStatus)
    }
  }, [attempt])

  const handleMarkCorrect = (questionAttemptId: string) => {
    const markData: MarkReqDto = {
      isCorrect: true
    }

    markQuestionAttempt({ questionAttemptId: questionAttemptId as string, data: markData }, {
      onSuccess: () => {
        setReviewStatus(prev => ({ ...prev, [questionAttemptId]: true }))

        toast.success("Marked as correct")
        refetch();
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Failed to mark as correct")
      }
    })
  }

  const handleMarkIncorrect = (questionAttemptId: string) => {
    const markData: MarkReqDto = {
      isCorrect: false
    }

    markQuestionAttempt({ questionAttemptId: questionAttemptId as string, data: markData }, {
      onSuccess: () => {
        setReviewStatus(prev => ({ ...prev, [questionAttemptId]: false }))

        toast.success("Marked as incorrect")
        refetch();
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Failed to mark as incorrect")
      }
    })
  }

  const handleSaveReview = async () => {
    setIsSaving(true)
    markQuestionSetAttempt({ questionSetAttemptId: id as string }, {
      onSuccess: () => {
        toast.success("Review saved successfully")
        refetch()

        router.push('/reviews')

        setIsSaving(false)
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Failed to save review")
        setIsSaving(false)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading attempt data...</h1>
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Attempt not found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't retrieve this attempt data.
          </p>
          <Button onClick={() => router.push('/reviews')}>
            Return to Review List
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Button
            variant="default"
            onClick={() => router.push('/admin/review')}
            className="gap-2 mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Review List
          </Button>
          <h1 className="text-2xl font-bold">Review Attempt</h1>
          <p className="text-muted-foreground">
            {attempt.questionSet.name} • {formatISODate(new Date(attempt.completedAt ?? "").toISOString())}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant={attempt.isChecked ? "default" : "secondary"}>
            {attempt.isChecked ? "Reviewed" : "Pending Review"}
          </Badge>
          <Button
            onClick={handleSaveReview}
            disabled={isSaving || attempt.isChecked}
          >
            {isSaving ? "Saving..." : "Save Review"}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Original Score</p>
              <p className="text-2xl font-bold">
                {attempt.score} / {attempt.questionAttempts.length}
              </p>
            </div>
            {/* <div>
              <p className="text-sm text-muted-foreground">Adjusted Score</p>
              <p className="text-2xl font-bold">
                {calculateNewScore()} / {attempt.questionAttempts.length}
              </p>
            </div> */}
            <div>
              <p className="text-sm text-muted-foreground">Percentage</p>
              <p className="text-2xl font-bold">
                {attempt.percentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      <Card>
        <CardHeader>
          <CardTitle>Questions Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {attempt.questionAttempts.map((questionAttempt, index) => {
            const currentStatus = reviewStatus[questionAttempt.id] ?? questionAttempt.isCorrect
            const isMcq = questionAttempt.question.type === QUESTION_TYPES.MCQ
            const isTrueFalse = questionAttempt.question.type === QUESTION_TYPES.TRUE_FALSE
            const isFillInTheBlanks = questionAttempt.question.type === QUESTION_TYPES.FILL_IN_THE_BLANKS
            const isTextAnswer = [
              QUESTION_TYPES.SHORT,
              QUESTION_TYPES.LONG
            ].includes(questionAttempt.question.type)

            return (
              <div key={questionAttempt.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">
                      Question {index + 1}: {questionAttempt.question.questionText}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{questionAttempt.question.type}</Badge>
                      <Badge variant="outline">
                        Difficulty: {questionAttempt.question.difficulty}/5
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={currentStatus ? "success" : "destructive"}>
                    {currentStatus ? "Correct" : "Incorrect"}
                  </Badge>
                </div>

                {/* User's Answer */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    User's Answer
                  </h4>
                  <div className={`p-3 rounded-md ${currentStatus ? 'bg-green-50' : 'bg-red-50'}`}>
                    {isMcq && (
                      questionAttempt.question.options.find(o => o.id === questionAttempt.selectedOptionId)?.optionText || "Not answered"
                    )}
                    {isTrueFalse && (
                      questionAttempt.selectedBooleanAnswer === null
                        ? "Not Answered"
                        : questionAttempt.selectedBooleanAnswer ? "True" : "False"
                    )}
                    {(isFillInTheBlanks || isTextAnswer) && (
                      <div className="whitespa)ce-pre-wrap">
                        {questionAttempt.selectedTextAnswer || "Not answered"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Correct Answer (for reference) */}
                {(!currentStatus && !isTextAnswer) && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Correct Answer
                    </h4>
                    <div className="p-3 rounded-md bg-green-50">
                      {isMcq && (
                        questionAttempt.question.options.find(o => o.isCorrect)?.optionText
                      )}
                      {isTrueFalse && (
                        questionAttempt.question.correctAnswerBoolean ? "True" : "False"
                      )}
                      {isFillInTheBlanks && (
                        <div className="whitespace-pre-wrap">
                          {questionAttempt.question.correctAnswerText}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Controls */}
                {
                  isTextAnswer && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant={currentStatus ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMarkCorrect(questionAttempt.id)}
                        disabled={attempt.isChecked}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Correct
                      </Button>
                      <Button
                        variant={!currentStatus ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleMarkIncorrect(questionAttempt.id)}
                        disabled={attempt.isChecked}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark Incorrect
                      </Button>
                    </div>
                  )
                }
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/review')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveReview}
          disabled={isSaving || attempt.isChecked}
        >
          {isSaving ? "Saving..." : "Save Review"}
        </Button>
      </div>
    </div>
  )
}