import { Option } from "@/types/option";
import { Question } from "@/types/question";

interface QuestionContentProps {
  question: Question;
}

export default function QuestionContent({ question }: QuestionContentProps) {
  return (
    <>
      {question.type === "mcq" && question.options && (
        <div className="my-4">
          <p className="font-medium">Options:</p>
          <ul className="mt-1 space-y-2">
            {question.options.map((option, i) => (
              <OptionItem
                key={i}
                option={option}
                index={i}
              />
            ))}
          </ul>
        </div>
      )}

      {/* {question.type === "short" && question.expectedKeywords && (
        <div className="mb-4">
          <p className="font-medium">Expected Keywords:</p>
          <p className="mt-1 text-muted-foreground">{question.expectedKeywords}</p>
        </div>
      )} */}

      {/* {question.type === "TRUE_FALSE" && question.options && (
        <div className="mb-4">
          <p className="font-medium">Correct Answer:</p>
          <p className="mt-1 text-green-600 font-medium">
            {question.options[0].isCorrect ? "True" : "False"}
          </p>
        </div>
      )} */}
    </>
  );
}

function OptionItem({ option, index }: { option: Option, index: number }) {
  return (
    <li className={`flex items-start gap-2 ${option.isCorrect ? "text-green-600 font-medium" : ""}`}>
      {option.isCorrect ? "✓" : "✗"} {String.fromCharCode(65 + index)}) {option.option}
    </li>
  );
}