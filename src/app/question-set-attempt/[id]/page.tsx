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
import { Trophy } from "lucide-react"
import { useTimer } from "@/hooks/api/useTimer"

export default function QuestionSetAttemptPage() {
  const { id } = useParams()

  // State management
  const [questions, setQuestions] = useState<QuestionAttempt[]>([])
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("")
  const [selectedValue, setSelectedValue] = useState<string | undefined>()
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0)

  const { data: questionSetAttempt, isLoading, refetch } = useGetQuestionSetAttemptDetail(id as string)
  const { mutate: answerQuestion, isPending } = useAnswerQuestion()
  const { mutate: finishQuestionSet, isPending: submitPending } = useFinishQuestionSetAttempt()

  const { formattedTime, isExpired } = useTimer(id as string, questionSetAttempt?.questionSet.isTimeLimited ?? false);

  // Initialize questions and current question
  useEffect(() => {
    if (questionSetAttempt?.questionAttempts) {
      setQuestions(questionSetAttempt.questionAttempts)
      if (currentQuestionId === "") {
        setCurrentQuestionId(questionSetAttempt.questionAttempts[0].id || "")
      }
      setAnsweredQuestions(questionSetAttempt.questionAttempts.filter(q => q.selectedBooleanAnswer !== null || q.selectedOptionId || q.selectedTextAnswer).length)
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
    if (currentQuestion?.question.type === QUESTION_TYPES.MCQ) {
      return currentQuestion.selectedOptionId
    } else if (currentQuestion?.question.type === QUESTION_TYPES.TRUE_FALSE) {
      if (currentQuestion.selectedBooleanAnswer === null) return null
      return currentQuestion.selectedBooleanAnswer ? "true" : "false"
    } else if (currentQuestion?.question.type === QUESTION_TYPES.FILL_IN_THE_BLANKS || currentQuestion?.question.type === QUESTION_TYPES.SHORT || currentQuestion?.question.type === QUESTION_TYPES.LONG) {
      return currentQuestion.selectedTextAnswer
    }
    return null
  }, [currentQuestion])

  // Navigation handler
  const handleNavigate = (direction: "prev" | "next", selectedValue?: string) => {
    if (selectedValue) {
      const answerData: AnswerReqDto = {
        questionAttemptId: currentQuestionId,
        selectedOptionId: currentQuestion?.question.type === QUESTION_TYPES.MCQ ? selectedValue : null,
        selectedBooleanAnswer: currentQuestion?.question.type === QUESTION_TYPES.TRUE_FALSE ? (selectedValue == "true" ? true : selectedValue == "false" ? false : null) : null,
        selectedTextAnswer: (currentQuestion?.question.type === QUESTION_TYPES.FILL_IN_THE_BLANKS
          || currentQuestion?.question.type === QUESTION_TYPES.LONG
          || currentQuestion?.question.type === QUESTION_TYPES.SHORT) ? selectedValue : null
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
    finishQuestionSet({ questionSetAttemptId: id as string }, {
      onSuccess: (res) => {
        refetch()

        toast.success(res.message)
      },
      onError: () => {
        // window.location.reload();
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
      <div className="flex flex-col items-center justify-center h-screen bg-secondary">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-accent-foreground p-8 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-52 w-52 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-accent mb-2">Quiz Completed!</h1>
            <p className="text-accent">You scored {questionSetAttempt.score} out of {questions.length}</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Your Score</h3>
                <p className="text-muted-foreground">{Math.round(questionSetAttempt.percentage)}%</p>
              </div>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${questionSetAttempt.percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600">Correct</p>
                <p className="text-2xl font-bold text-green-800">
                  {questionSetAttempt.score}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-red-600">Incorrect</p>
                <p className="text-2xl font-bold text-red-800">
                  {questions.length - questionSetAttempt.score}
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <Button
                className="w-full"
                variant="default"
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

  if (questionSetAttempt.questionSet.isTimeLimited && formattedTime === "00:00:00") {
    return (
      <div className="flex items-center justify-center h-screen bg-muted">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">Time's Up!</h2>
          <p className="text-muted-foreground">
            Your time for this quiz has expired. Please submit your answers.
          </p>
          <Button
            className="mt-4"
            onClick={onSubmit}
            disabled={submitPending}
          >
            {submitPending ? "Submitting..." : "Submit Answers"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-muted">
      <QuizHeader
        name={questionSetAttempt.questionSet.name}
        currentQuestion={currentIndex + 1}
        totalQuestions={questions.length}
        formattedTime={formattedTime}
        isExpired={isExpired}
      />

      <div className="flex flex-1 overflow-hidden">
        <QuestionNavigation
          questions={questions}
          currentQuestionId={currentQuestionId}
          onQuestionSelect={handleQuestionSelect}
        />

        {currentQuestion && (
          <QuestionContent
            questionAttempt={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            answeredQuestions={answeredQuestions}
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