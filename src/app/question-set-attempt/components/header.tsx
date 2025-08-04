// components/question-set/header.tsx
"use client"

import { ArrowLeft, Clock, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

type QuestionSetHeaderProps = {
  name: string
  currentQuestion: number
  totalQuestions: number
  formattedTime: string
  isExpired?: boolean
  isTimeCritical?: boolean
  attemptNumber: number
  onNavToggle: () => void
}

export function QuestionSetHeader({
  name,
  currentQuestion,
  totalQuestions,
  formattedTime,
  isExpired,
  isTimeCritical,
  attemptNumber,
  onNavToggle,
}: QuestionSetHeaderProps) {
  const router = useRouter()
  const progressValue = Math.round((currentQuestion / totalQuestions) * 100)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-background border-b w-full">
      <div className="px-4 py-3 flex items-center justify-between gap-2"> {/* Reduced gap */}
        <div className="flex items-center gap-2 min-w-0"> {/* Added min-w-0 and reduced gap */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={onNavToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {!isMobile && (
            <div className="truncate space-y-1 min-w-0">
              <h1 className="truncate font-medium text-sm md:text-base">
                {name} | Attempt: {attemptNumber}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                Question {currentQuestion} of {totalQuestions}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 min-w-0"> {/* Added min-w-0 */}
          {isMobile && isTimeCritical && (
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm whitespace-nowrap">
              {formattedTime}
            </div>
          )}

          {!isMobile && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
              isExpired ? 'bg-red-100 text-red-800' : 'bg-accent'
            } ${isTimeCritical ? 'animate-pulse' : ''}`}>
              <Clock className="h-4 w-4 shrink-0" />
              <span className="font-mono text-sm whitespace-nowrap">
                {formattedTime}
              </span>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div className="px-4 pb-2 flex justify-between items-center">
          <div className="truncate min-w-0">
            <h1 className="truncate font-medium text-sm">
              {name.split(' ').slice(0, 3).join(' ')}... {/* Truncated title */}
            </h1>
            <p className="text-xs text-muted-foreground">
              Q{currentQuestion}/{totalQuestions}
            </p>
          </div>
          {!isTimeCritical && (
            <div className="bg-accent px-2 py-1 rounded-md text-sm whitespace-nowrap">
              {formattedTime}
            </div>
          )}
        </div>
      )}

      <Progress value={progressValue} className="h-1 rounded-none" />
    </header>
  )
}