import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/question";
import QuestionContent from "./content";
import QuestionFooter from ".//footer";
import { StatusBadge } from "@/components/ui/status-badge";
import { questionTypes } from "@/enums/questions";

interface QuestionAccordionItemProps {
  question: Question;
  isExpanded: boolean;
  onToggle: () => void;
  handleApprove?: (questionId: string) => void;
  handleReject?: (questionId: string) => void;
}

export function QuestionAccordionItem({
  question,
  isExpanded,
  onToggle,
  handleApprove,
  handleReject
}: QuestionAccordionItemProps) {
  return (
    <div className="border-4 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-gray-100 flex justify-between items-center"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="text-left">
            {/* <span className="text-sm text-muted-foreground mr-3">#{question.id}</span> */}
            <span className="font-medium">
              {question.subject.name} → {question.subSubject.name} →
            </span>
            <span className="ml-3 ">Q: {question.question}</span>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">{questionTypes.find(x => x.value == question.type)?.label}</Badge>
              {/* <DifficultyStars difficulty={question.difficulty} /> */}
            </div>
          </div>
        </div>
        <StatusBadge status={question.status} />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t">
          <QuestionContent question={question} />
          <QuestionFooter handleApprove={handleApprove} handleReject={handleReject} question={question} />
        </div>
      )}
    </div>
  );
}