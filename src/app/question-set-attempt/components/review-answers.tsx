import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QUESTION_TYPES } from "@/constants/questions";
import { QuestionAttempt } from "@/types/question-set-attempt";
import { Edit } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ReviewAnswerProps {
  questions: QuestionAttempt[];
  setCurrentQuestionId: (id: string) => void;
  setShowReviewModal: (showReviewModal: boolean) => void;
  onSubmit: () => void;
  submitPending: boolean;
  answeredQuestions: number;
  answeredAll: boolean;
}

export default function ReviewAnswers({
  questions,
  setCurrentQuestionId,
  setShowReviewModal,
  onSubmit,
  submitPending,
  answeredAll,
  answeredQuestions
}: ReviewAnswerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleQuestionSelect = (id: string) => {
    setCurrentQuestionId(id);
    setShowReviewModal(false);
  };

  return (
    <div className="mx-4 sm:mx-8 lg:mx-16 my-4 sm:my-6 lg:my-8">
      <p className="text-sm text-muted-foreground mb-4">
        {answeredAll
          ? "All questions answered - ready to submit!"
          : `You have ${questions.length - answeredQuestions} unanswered question${questions.length - answeredQuestions !== 1 ? 's' : ''}`
        }
      </p>
      
      <div className="space-y-4 sm:space-y-6">
        {questions.map((question, index) => {
          const currentAnswer =
            question.question.type === QUESTION_TYPES.MCQ
              ? question.selectedOptionId
                ? question.question.options.find(o => o.id === question.selectedOptionId)?.optionText
                : "Not answered"
              : question.question.type === QUESTION_TYPES.TRUE_FALSE
                ? (question.selectedBooleanAnswer === null 
                    ? "Not answered" 
                    : question.selectedBooleanAnswer ? "True" : "False")
                : question.selectedTextAnswer || "Not answered";

          return (
            <Card key={question.id} className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="font-medium text-base sm:text-lg break-words">
                    Q{index + 1}: {question.question.questionText}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {question.question.type}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => handleQuestionSelect(question.id)}
                  className="gap-2 shrink-0"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Update</span>
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Your Answer:
                </h4>
                <div className={`p-3 rounded-md bg-muted text-sm sm:text-base break-words ${
                  currentAnswer === "Not answered" ? "text-muted-foreground italic" : ""
                }`}>
                  {currentAnswer}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={() => setShowReviewModal(false)}
          className="w-full sm:w-auto"
        >
          Close
        </Button>
        <Button
          size={isMobile ? "sm" : "default"}
          onClick={() => {
            onSubmit();
            setShowReviewModal(false);
          }}
          disabled={submitPending}
          className="w-full sm:w-auto"
        >
          {submitPending ? "Submitting..." : "Submit All Answers"}
        </Button>
      </div>
    </div>
  );
}