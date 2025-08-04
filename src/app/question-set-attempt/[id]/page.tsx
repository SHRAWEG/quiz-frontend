"use client";

import { useEffect, useMemo, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { QuestionSetLayout } from "../components/layout";
import {
  useAnswerQuestion,
  useFinishQuestionSetAttempt,
  useGetQuestionSetAttemptDetail,
} from "@/hooks/api/useQuestionSetAttempt";
import { AnswerReqDto } from "@/types/question-set-attempt";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionContent } from "../components/question-content";
import { toast } from "sonner";
import { QUESTION_TYPES } from "@/constants/questions";
import { useTimer } from "@/hooks/api/useTimer";
import { ApiError } from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReviewAnswers from "../components/review-answers";

export default function QuestionSetAttemptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submitConfirmation, setSubmitConfirmation] = useState(false);

  const {
    data: questionSetAttempt,
    isLoading,
    refetch,
  } = useGetQuestionSetAttemptDetail(id as string);
  const { mutate: answerQuestion, isPending } = useAnswerQuestion();
  const { mutate: finishQuestionSet, isPending: submitPending } =
    useFinishQuestionSetAttempt();
  const { formattedTime, isExpired, isTimeCritical } = useTimer(id as string);

  // Initialize questions and current question
  useEffect(() => {
    if (questionSetAttempt?.questionAttempts && currentQuestionId === "") {
      setCurrentQuestionId(questionSetAttempt.questionAttempts[0]?.id || "");
    }
  }, [questionSetAttempt, currentQuestionId]);

  // Derived values
  const questions = questionSetAttempt?.questionAttempts || [];
  const currentQuestion = useMemo(
    () => questions.find((q) => q.id === currentQuestionId),
    [currentQuestionId]
  );

  const currentIndex = useMemo(
    () => questions.findIndex((q) => q.id === currentQuestionId),
    [currentQuestionId]
  );

  const answeredQuestions = useMemo(
    () =>
      questions.filter(
        (q) =>
          q.selectedBooleanAnswer !== null ||
          q.selectedOptionId ||
          q.selectedTextAnswer
      ).length,
    []
  );

  const answeredAll = useMemo(
    () =>
      questions.every(
        (q) =>
          q.selectedBooleanAnswer !== null ||
          q.selectedOptionId ||
          q.selectedTextAnswer
      ),
    []
  );

  const selectedVal = useMemo(() => {
    if (!currentQuestion) return null;
    switch (currentQuestion.question.type) {
      case QUESTION_TYPES.MCQ:
        return currentQuestion.selectedOptionId;
      case QUESTION_TYPES.TRUE_FALSE:
        return currentQuestion.selectedBooleanAnswer === null
          ? null
          : currentQuestion.selectedBooleanAnswer
          ? "true"
          : "false";
      case QUESTION_TYPES.FILL_IN_THE_BLANKS:
      case QUESTION_TYPES.SHORT:
      case QUESTION_TYPES.LONG:
        return currentQuestion.selectedTextAnswer;
      default:
        return null;
    }
  }, [currentQuestion]);

  // Handlers
  const handleNavigate = (
    direction: "prev" | "next",
    selectedValue?: string
  ) => {
    if (direction === "next") {
      if (selectedValue) {
        const answerData: AnswerReqDto = {
          questionAttemptId: currentQuestionId,
          selectedOptionId:
            currentQuestion?.question.type === QUESTION_TYPES.MCQ
              ? selectedValue
              : null,
          selectedBooleanAnswer:
            currentQuestion?.question.type === QUESTION_TYPES.TRUE_FALSE
              ? selectedValue === "true"
                ? true
                : selectedValue === "false"
                ? false
                : null
              : null,
          selectedTextAnswer: [
            QUESTION_TYPES.FILL_IN_THE_BLANKS,
            QUESTION_TYPES.LONG,
            QUESTION_TYPES.SHORT,
          ].includes(currentQuestion?.question.type as any)
            ? selectedValue
            : null,
        };

        answerQuestion(
          { questionSetAttemptId: id as string, data: answerData },
          {
            onSuccess: () => {
              const newIndex = currentIndex + 1;
              if (newIndex >= 0 && newIndex < questions.length) {
                setCurrentQuestionId(questions[newIndex].id);
              }
              setSelectedValue("");
              refetch();
            },
            onError: (error: ApiError) => {
              toast.error("Error submitting answer: " + error.data.message);
            },
          }
        );
      } else {
        const newIndex = currentIndex + 1;
        if (newIndex >= 0 && newIndex < questions.length) {
          setCurrentQuestionId(questions[newIndex].id);
        }
        setSelectedValue("");
      }
    } else {
      const newIndex = currentIndex - 1;
      if (newIndex >= 0) {
        setCurrentQuestionId(questions[newIndex].id);
      }
      setSelectedValue("");
    }
  };

  const handleQuestionSelect = (questionId: string) => {
    setCurrentQuestionId(questionId);
    setSelectedValue("");
    setShowReviewModal(false);
  };

  const onSubmit = () => {
    finishQuestionSet(
      { questionSetAttemptId: id as string },
      {
        onSuccess: (res) => {
          router.push(`/question-set-attempt/${id}/results`);
          toast.success(res.message);
        },
        onError: () => {
          refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (questionSetAttempt?.questionSet.isTimeLimited && isExpired) {
      onSubmit();
    }
  }, [isExpired, questionSetAttempt?.questionSet.isTimeLimited]);

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
    );
  }

  // Error state
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
    );
  }

  if (questionSetAttempt.isCompleted) {
    redirect(`/question-set-attempt/${id}/results`);
  }

  return (
    <QuestionSetLayout
      questions={questions}
      currentQuestionId={currentQuestionId}
      onQuestionSelect={handleQuestionSelect}
      headerProps={{
        name: questionSetAttempt.questionSet.name,
        attemptNumber: questionSetAttempt.attemptNumber,
        currentQuestion: currentIndex + 1,
        totalQuestions: questions.length,
        formattedTime,
        isExpired,
        isTimeCritical: questionSetAttempt.questionSet.isTimeLimited
          ? isTimeCritical
          : false,
      }}
    >
      {showReviewModal ? (
        <ReviewAnswers
          questions={questions}
          setCurrentQuestionId={setCurrentQuestionId}
          setShowReviewModal={setShowReviewModal}
          onSubmit={onSubmit}
          submitPending={submitPending}
          answeredAll={answeredAll}
          answeredQuestions={answeredQuestions}
        />
      ) : currentQuestion ? (
        <QuestionContent
          questionAttempt={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          answeredQuestions={answeredQuestions}
          selectedValue={selectedValue || selectedVal || ""}
          setSelectedValue={setSelectedValue}
          setShowReviewModal={setShowReviewModal}
          onNavigate={handleNavigate}
          isPending={isPending}
          setSubmitConfirmation={setSubmitConfirmation}
          submitPending={submitPending}
        />
      ) : null}

      <AlertDialog
        open={submitConfirmation}
        onOpenChange={setSubmitConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to submit?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {answeredAll
                ? "You've answered all questions. You won't be able to make changes after submission."
                : "You haven't answered all questions. Are you sure you want to submit anyway?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </QuestionSetLayout>
  );
}
