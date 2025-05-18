"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { QuizHeader } from "../components/header"
import { QuestionNavigation } from "../components/question-nav"
import { useAnswerQuestion, useFinishQuestionSetAttempt, useGetQuestionSetAttemptDetail } from "@/hooks/api/useQuestionSetAttempt"
import { AnswerReqDto, QuestionAttempt } from "@/types/question-set-attempt"
import { Skeleton } from "@/components/ui/skeleton"
import { QuestionContent } from "../components/question-content"
import { toast } from "sonner"
import { QUESTION_TYPES } from "@/constants/questions"
import { Button } from "@/components/ui/button"

export default function QuestionSetAttemptPage() {
  const { id } = useParams()

  // State management
  const [questions, setQuestions] = useState<QuestionAttempt[]>([])
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("")
  const [selectedValue, setSelectedValue] = useState<string | undefined>()

  const { data: questionSetAttempt, isLoading, refetch } = useGetQuestionSetAttemptDetail(id as string)
  const { mutate: answerQuestion, isPending } = useAnswerQuestion()
  const { mutate: finishQuestionSet, isPending: submitPending } = useFinishQuestionSetAttempt()

  // Initialize questions and current question
  useEffect(() => {
    if (questionSetAttempt?.questionSet?.questions) {
      setQuestions(questionSetAttempt.questionSet.questions)
      if (currentQuestionId === "") {
        setCurrentQuestionId(questionSetAttempt.questionSet.questions[0]?.id || "")
      }
    }
  }, [questionSetAttempt, currentQuestionId])

  // Derived values
  const currentQuestion = useMemo(() => (
    questions.find(q => q.id === currentQuestionId)
  ), [questions, currentQuestionId])

  const currentIndex = useMemo(() => (
    questions.findIndex(q => q.id === currentQuestionId)
  ), [questions, currentQuestionId])

  const selectedVal = useMemo(() => {
    if (currentQuestion?.type === QUESTION_TYPES.MCQ) {
      return currentQuestion.questionAttempts[0]?.selectedOptionId
    } else if (currentQuestion?.type === QUESTION_TYPES.TRUE_FALSE) {
      if (currentQuestion.questionAttempts.length === 0) return null
      return currentQuestion.questionAttempts[0]?.selectedBooleanAnswer ? "true" : "false"
    } else if (currentQuestion?.type === QUESTION_TYPES.FILL_IN_THE_BLANKS) {
      return currentQuestion.questionAttempts[0]?.selectedTextAnswer
    }
    return null
  }, [currentQuestion])

  // Navigation handler
  const handleNavigate = (direction: "prev" | "next", selectedValue?: string) => {
    if (selectedValue) {
      const answerData: AnswerReqDto = {
        questionId: currentQuestionId,
        selectedOptionId: currentQuestion?.type === QUESTION_TYPES.MCQ ? selectedValue : null,
        selectedBooleanAnswer: currentQuestion?.type === QUESTION_TYPES.TRUE_FALSE ? (selectedValue == "true" ? true : selectedValue == "false" ? false : null) : null,
        selectedTextAnswer: currentQuestion?.type === QUESTION_TYPES.FILL_IN_THE_BLANKS ? selectedValue : null
      }

      answerQuestion({ questionSetAttemptId: id as string, data: answerData }, {
        onSuccess: (res) => {
          const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1
          if (newIndex >= 0 && newIndex < questions.length) {
            setCurrentQuestionId(questions[newIndex].id)
          }
          setSelectedValue("")

          refetch();

          toast.success(res.message)
        },
        onError: (error) => {
          toast.error("Error submitting answer: " + error.message)
        }
      })
    } else {
      const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1
      if (newIndex >= 0 && newIndex < questions.length) {
        setCurrentQuestionId(questions[newIndex].id)
      }
      setSelectedValue("")
    }
  }

  const handleQuestionSelect = (questionId: string) => {
    setCurrentQuestionId(questionId)
    setSelectedValue("")
  }

  const onSubmit = () => {
    finishQuestionSet({ questionSetId: id as string }, {
      onSuccess: (res) => {
        refetch()

        toast.success(res.message)
      }
    })
  }

  // Loading state
  if (isLoading || !questionSetAttempt) {
    return (
      <div className="flex flex-col h-screen bg-muted">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-1/3" />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <Skeleton className="w-1/4 border-r" />
          <div className="flex-1 p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Error state (if needed)
  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">No questions found</h2>
          <p className="text-muted-foreground">
            This quiz attempt doesn't contain any questions.
          </p>
        </div>
      </div>
    )
  }

  if (questionSetAttempt.isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trophy"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h1>
            <p className="text-blue-100">You scored {questionSetAttempt.score} out of {questions.length}</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Your Score</h3>
                <p className="text-muted-foreground">{Math.round(questionSetAttempt.percentage)}%</p>
              </div>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${questionSetAttempt.percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600">Correct</p>
                <p className="text-2xl font-bold text-blue-800">
                  {questionSetAttempt.score}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-purple-600">Incorrect</p>
                <p className="text-2xl font-bold text-purple-800">
                  {questions.length - questionSetAttempt.score}
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => window.location.href = `/question-set-attempt/${id}/results`}
              >
                View Detailed Results
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  console.log(selectedVal)

  return (
    <div className="flex flex-col h-screen bg-muted">
      <QuizHeader
        name={questionSetAttempt.questionSet.name}
        currentQuestion={currentIndex + 1}
        totalQuestions={questions.length}
      />

      <div className="flex flex-1 overflow-hidden">
        <QuestionNavigation
          questions={questions}
          currentQuestionId={currentQuestionId}
          onQuestionSelect={handleQuestionSelect}
        />

        {currentQuestion && (
          <QuestionContent
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            answeredQuestions={5}
            selectedValue={selectedValue || selectedVal || ""}
            setSelectedValue={setSelectedValue}
            onNavigate={handleNavigate}
            isPending={isPending}
            onSubmit={onSubmit}
            submitPending={submitPending}

          />
        )}
      </div>
    </div>
  )
}