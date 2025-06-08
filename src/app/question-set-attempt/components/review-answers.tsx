import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QUESTION_TYPES } from "@/constants/questions";
import { QuestionAttempt } from "@/types/question-set-attempt";
import { Edit } from "lucide-react";

interface ReviewAnswerProps {
  questions: QuestionAttempt[]
  setCurrentQuestionId: (id: string) => void
  setShowReviewModal: (showReviewModal: boolean) => void
  onSubmit: () => void
  submitPending: boolean
  answeredQuestions: number
  answeredAll: boolean
}

export default function ReviewAnswers(
  {
    questions,
    setCurrentQuestionId,
    setShowReviewModal,
    onSubmit,
    submitPending,
    answeredAll,
    answeredQuestions
  }: ReviewAnswerProps
) {
  return (
    <div className="mx-16 my-8">
      <p className="text-sm text-muted-foreground">
        {answeredAll ?
          "All questions answered - ready to submit!" :
          `You have ${questions.length - answeredQuestions} unanswered questions`
        }
      </p>
      <div className="space-y-6">
        {questions.map((question, index) => {
          const currentAnswer =
            question.question.type === QUESTION_TYPES.MCQ ?
              question.selectedOptionId ?
                question.question.options.find(o => o.id === question.selectedOptionId)?.optionText
                : "Not answered" :
              question.question.type === QUESTION_TYPES.TRUE_FALSE ?
                (question.selectedBooleanAnswer === null ? "Not answered" :
                  question.selectedBooleanAnswer ? "True" : "False") :
                question.selectedTextAnswer || "Not answered";

          return (
            <Card key={question.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">
                    Question {index + 1}: {question.question.questionText}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{question.question.type}</Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentQuestionId(question.id);
                    setShowReviewModal(false);
                  }}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Update Answer
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Your Answer:
                </h4>
                <div className={`p-3 rounded-md bg-muted ${currentAnswer === "Not answered" ? "text-muted-foreground italic" : ""
                  }`}>
                  {currentAnswer}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setShowReviewModal(false)}
        >
          Close
        </Button>
        <Button
          onClick={() => {
            onSubmit();
            setShowReviewModal(false);
          }}
          disabled={submitPending}
        >
          Submit All Answers
        </Button>
      </div>
    </div>
  )
}