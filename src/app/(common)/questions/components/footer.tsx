"use client";

import { Button } from "@/components/ui/button";
import { useApproveQuestion, useGetQuestions, useRejectQuestion } from "@/hooks/api/useQuestion";
import { useUser } from "@/hooks/useUser";
import { Question } from "@/types/question";
import Link from "next/link";

interface QuestionFooterProps {
  question: Question;
  handleApprove?: (questionId: string) => void;
  handleReject?: (questionId: string) => void;
}


export default function QuestionFooter({ question, handleApprove, handleReject }: QuestionFooterProps) {
  const { role } = useUser();
  const fullName: string = `${question.createdBy.firstName} ${question.createdBy.middleName} ${question.createdBy.lastName}`;

  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm text-muted-foreground space-x-4">
        <span>Created at: {new Date(question.createdAt).toLocaleDateString()}</span>
      </p>
      <p className="text-sm text-muted-foreground font-bold">
        <span>Created by: {fullName} | {question.createdBy.email} </span>
      </p>
      <div className="space-x-2">
        {
          role === "admin" && (
            <>
              <Button variant="default" onClick={(): void => handleApprove?.(question.id)} size="sm">Approve</Button>
              <Button variant="destructive" onClick={(): void => handleReject?.(question.id)} size="sm">Reject</Button>
            </>
          )
        }
        {
          role === "teacher" && (
            <Link href={`/questions/update/${question.id}`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
          )
        }
      </div>
    </div>
  );
}