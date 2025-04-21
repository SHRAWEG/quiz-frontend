import { Button } from "@/components/ui/button";
import { useApproveQuestion, useGetQuestions, useRejectQuestion } from "@/hooks/api/useQuestion";
import { useUser } from "@/hooks/useUser";
import { Question } from "@/types/question";
import Link from "next/link";

interface QuestionFooterProps {
  question: Question;
}

export default function QuestionFooter({ question }: QuestionFooterProps) {
  const { role } = useUser();

  // const { refetch } = useGetQuestions();

  // const {mutate: approveQuestion} = useApproveQuestion();
  // const {mutate: rejectQuestion} = useRejectQuestion();

  // const handleApprove = () => {
  //   approveQuestion({ questionId: question.id}, {
  //     onSuccess: () => {
  //       refetch();
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //     }
  //   })    
  // }

  // const handleReject = () => {
  //   rejectQuestion({ questionId: question.id}, {
  //     onSuccess: () => {
  //       refetch();
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //     }
  //   })    
  // }
  
  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm text-muted-foreground space-x-4">
        <span>Created: {new Date(question.createdAt).toLocaleDateString()}</span>
      </p>
      <div className="space-x-2">
        {
          role === "admin" && (
            <>
              <Button variant="default" size="sm">Approve</Button>
              <Button variant="destructive" size="sm">Reject</Button>
            </>
          )
        }
        {
          role === "teacher" && (
            <Link href={`/questions//update/${question.id}`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
          )
        }
      </div>
    </div>
  );
}