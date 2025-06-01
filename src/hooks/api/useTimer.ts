import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiResponse } from '@/lib/axios';
import { API_URLS } from '@/lib/constants/api-urls';

export type TimerResponse = {
  id: string;
  remainingTimeSeconds: number;
  startedAt: string;
  expiryAt: string;
  isExpired: boolean;
  timeLimitSeconds: number | null;
  isCompleted: boolean;
};

export function useTimer(attemptId: string, isTimeLimited: boolean) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Fetch initial time and auto-refetch
  const { data } = useQuery<TimerResponse>({
    queryKey: ['quiz-time', attemptId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TimerResponse>>(
        `${API_URLS.questionSetAttempt}/status/${attemptId}`
      );
      return response.data;
    },
    refetchInterval: 30000, // Sync every 5 minutes
  });

  useEffect(() => {
    if (data) {
      setTimeLeft(data.remainingTimeSeconds);
    }
  }, [data]);

  // Countdown effect
  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    expiryAt: data?.expiryAt,
    isExpired: data?.isExpired || false
  };
}