// components/question-set/layout.tsx
"use client"

import { useState } from "react"
import { QuestionSetHeader } from "./header"
import { QuestionSetNavigation } from "./navigation"
import { QuestionAttempt } from "@/types/question-set-attempt"

interface QuestionSetLayoutProps {
  questions: QuestionAttempt[]
  currentQuestionId: string
  onQuestionSelect: (id: string) => void
  children: React.ReactNode
  headerProps: {
    name: string
    attemptNumber: number
    currentQuestion: number
    totalQuestions: number
    formattedTime: string
    isExpired?: boolean
    isTimeCritical?: boolean
  }
}

export function QuestionSetLayout({
  questions,
  currentQuestionId,
  onQuestionSelect,
  children,
  headerProps
}: QuestionSetLayoutProps) {
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-muted"> {/* Changed to muted background */}
      <QuestionSetHeader {...headerProps} onNavToggle={() => setIsNavOpen(!isNavOpen)} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <QuestionSetNavigation
          questions={questions}
          currentQuestionId={currentQuestionId}
          onQuestionSelect={(id) => {
            onQuestionSelect(id)
            setIsNavOpen(false)
          }}
          isOpen={isNavOpen}
        />

        <main className="flex-1 overflow-auto p-4 bg-muted">
          {children}
        </main>
      </div>
    </div>
  )
}