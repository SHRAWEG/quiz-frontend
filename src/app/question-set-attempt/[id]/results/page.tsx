"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useParams } from "next/navigation"
import { useGetQuestionSetAttemptResult } from "@/hooks/api/useQuestionSetAttempt"
import { ChevronLeft, Clock, Award, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { QUESTION_TYPES } from "@/constants/questions"

export default function QuizResultsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data, isLoading } = useGetQuestionSetAttemptResult(id as string)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Calculating your data...</h1>
          <Progress value={0} className="w-60 h-2 mx-auto" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Results not available</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't retrieve your quiz data.
          </p>
          <Button onClick={() => router.push('/')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Calculate derived values
  // const data.score = data.questionSet.questions.filter(
  //   q => q.status === "answered" &&
  //     (q.selectedOptionId === q.correctOptionId ||
  //       q.selectedBooleanAnswer === q.correctBooleanAnswer ||
  //       q.selectedTextAnswer === q.correctTextAnswer)
  // ).length

  const totalQuestions = data.questionAttempts.length

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Results</h1>
        <p className="text-muted-foreground">{data.questionSet.name}</p>
        <div className="flex justify-center mt-2">
          <Badge variant={data.questionSet.isFree ? "secondary" : "premium"} className="mr-2">
            {data.questionSet.isFree ? "Free" : "Premium"}
          </Badge>
          <Badge variant="outline">
            {data.questionSet.category?.name}
          </Badge>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Score</CardTitle>
            <Award className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold mb-2">
              {Math.round(data.percentage)}%
            </div>
            <p className="text-muted-foreground mb-4">
              {data?.score} out of {totalQuestions} correct
            </p>
            <Progress
              value={data.percentage}
              className={`"h-3"
                ${data.percentage >= 70 ? "bg-green-500" :
                  data.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Time</CardTitle>
            <Clock className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {/* Math.floor(timeSpent / 60)}m {timeSpent % 60 */} TBA
            </div>
            {/* {data.questionSet.isTimer && (
              <p className="text-muted-foreground">
                {timeSpent < data.questionSet.timer * 60 ? (
                  <span className="text-green-500">Finished with {Math.floor((data.questionSet.timer * 60 - timeSpent) / 60)}m {(data.questionSet.timer * 60 - timeSpent) % 60}s remaining</span>
                ) : (
                  <span className="text-red-500">Exceeded time limit</span>
                )}
              </p>
            )} */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Breakdown</CardTitle>
            <BookOpen className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Correct</span>
                <span className="font-medium text-green-600">
                  {data.score} ({Math.round((data.score / totalQuestions) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Incorrect</span>
                <span className="font-medium text-red-600">
                  {totalQuestions - data.score} ({Math.round(((totalQuestions - data.score) / totalQuestions) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium">
                  {data.questionAttempts.reduce((acc, q) => acc + q.question.difficulty, 0) / totalQuestions}/5
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Breakdown */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.questionAttempts.map((questionAttempt, index) => {
            const isCorrect = questionAttempt.isCorrect

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
                  <Badge variant={isCorrect ? "success" : "destructive"}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>

                {questionAttempt.question.type === QUESTION_TYPES.MCQ && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Your Answer
                      </h4>
                      <div className={`p-3 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        {questionAttempt.question.options.find(o => o.id === questionAttempt.selectedOptionId)?.optionText || "Not answered"}
                      </div>
                    </div>
                    {!isCorrect && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Correct Answer
                        </h4>
                        <div className="p-3 rounded-md bg-green-50">
                          {questionAttempt.question.options.find(o => o.isCorrect)?.optionText}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(questionAttempt.question.type === QUESTION_TYPES.TRUE_FALSE) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Your Answer
                      </h4>
                      <div className={`p-3 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        {questionAttempt.selectedBooleanAnswer === null ? "Not Answered" : questionAttempt.selectedBooleanAnswer ? "True" : "False"}
                      </div>
                    </div>
                    {!isCorrect && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Correct Answer
                        </h4>
                        <div className="p-3 rounded-md bg-green-50">
                          {questionAttempt.question.correctAnswerBoolean ? "True" : "False"}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(questionAttempt.question.type === QUESTION_TYPES.FILL_IN_THE_BLANKS) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Your Answer
                      </h4>
                      <div className={`p-3 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        {questionAttempt.selectedTextAnswer || "Not answered"}
                      </div>
                    </div>
                    {!isCorrect && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Correct Answer
                        </h4>
                        <div className="p-3 rounded-md bg-green-50">
                          {questionAttempt.question.correctAnswerText}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* <Button
          variant="outline"
          onClick={() => router.push(`/quiz/${id}/review`)}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Review Answers
        </Button>
        <Button
          onClick={() => router.push(`/quiz/${data.questionSetId}/retake`)}
          className="gap-2"
        >
          <ChevronRight className="h-4 w-4" />
          Retake Quiz
        </Button> */}
        <Button
          variant="secondary"
          onClick={() => router.push('/')}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}