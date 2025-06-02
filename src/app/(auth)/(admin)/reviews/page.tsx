"use client";

import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetQuestionSetAttemptsToReview } from '@/hooks/api/useQuestionSetAttempt';
import { QuestionSetAttempt } from '@/types/question-set-attempt';
import { formatISODate } from '@/lib/format-date';
import { Card } from '@/components/ui/card';

export default function ReviewListPage() {
  const { data: attempts, isLoading, error } = useGetQuestionSetAttemptsToReview();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load attempts: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!attempts || attempts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No attempts need review at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attempts Needing Review</h1>
        <p className="text-sm text-muted-foreground">
          {attempts.length} attempt(s) to review
        </p>
      </div>

      <div className="grid gap-4">
        {attempts.map((attempt) => (
          <AttemptCard key={attempt.id} attempt={attempt} />
        ))}
      </div>
    </div>
  );
}

function AttemptCard({ attempt }: { attempt: QuestionSetAttempt }) {
  return (
    <Card className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-medium text-lg">
            {attempt.questionSet?.name || "Untitled Question Set"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {attempt.isChecked ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Reviewed</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-yellow-500" />
                <span>Needs Review</span>
              </>
            )}
            <span>•</span>
            <span>
              Completed: {formatISODate(attempt?.completedAt?.toString() ?? "")}
            </span>
          </div>
        </div>

        <Button asChild variant={attempt.isChecked ? 'outline' : 'default'}>
          <Link href={`/reviews/${attempt.id}`}>
            {attempt.isChecked ? 'View Details' : 'Review Now'}
          </Link>
        </Button>
      </div>
    </Card>
  );
}