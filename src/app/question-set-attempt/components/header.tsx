"use client"

import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

interface QuizHeaderProps {
  name: string
  timeLimit?: number // in seconds
  currentQuestion: number
  totalQuestions: number
  formattedTime?: string
  isExpired?: boolean
}

export function QuizHeader({
  name,
  currentQuestion,
  totalQuestions,
  formattedTime,
  isExpired
}: QuizHeaderProps) {
  const router = useRouter()

  // Calculate progress percentage
  const progressValue = Math.round((currentQuestion / totalQuestions) * 100)

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Section - Back Button & Quiz Info */}
        <div className="flex items-center gap-4 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="truncate space-y-1">
            <h1 className="truncate font-medium text-sm md:text-base">
              {name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${isExpired ? 'bg-red-100 text-red-800' : 'bg-accent'
          }`}>
          <Clock className="h-4 w-4" />
          <span className="font-mono text-sm">
            {formattedTime}
          </span>
        </div>

        {/* Right Section - Timer & Controls */}

        {/* <div className="flex items-center gap-3">
          {timeLimit && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm">
                {formatTime(timeLimit)}
              </span>
            </div>
          )}
        </div> */}
      </div>

      {/* Progress Bar */}
      <Progress
        value={progressValue}
        className="h-1 rounded-none"
      />
    </header>
  )
}