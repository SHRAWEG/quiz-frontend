"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, Clock, Award, TrendingUp, Bell } from "lucide-react";
import { useGetQuestionSetAttempts } from "@/hooks/api/useQuestionSetAttempt";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatISODate } from "@/lib/format-date";
import { useStudentsDashboard } from "@/hooks/api/useDashboard";
import { Leaderboard } from "./leaderboard";
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import Link from 'next/link';

export default function StudentDashboard() {
  const router = useRouter();
  const { data } = useStudentsDashboard();

  const params = {
    page: 1,
    limit: 10,
    search: "",
    status: "pending",
  };

  const { data: questionSetAttempts } = useGetQuestionSetAttempts(params);

  function formatTime(rawSeconds: number) {
    const seconds = Math.floor(rawSeconds);
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");

    return `${hrs} : ${mins} : ${secs}`;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>

      {/* Notices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-500" />
            Active Notices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {data?.activeNotices.map((notice) => (
              <div key={notice.id} className="flex flex-col">
                <h3 className="text-lg font-bold">{notice.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Question Sets Completed
                </p>
                <h3 className="text-2xl font-bold">
                  {data?.completedQuestionSets}
                </h3>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Question Sets
                </p>
                <h3 className="text-2xl font-bold">
                  {data?.incompleteQuestionSets}
                </h3>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total question Sets Attempted
                </p>
                <h3 className="text-2xl font-bold">
                  {data?.totalQuestionSetsAttempted}
                </h3>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Time Spent
                </p>
                <h3 className="text-2xl font-bold">
                  {data?.timeSpentInSeconds
                    ? formatTime(data?.timeSpentInSeconds)
                    : 0}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 col-span-1 md:col-span-2 lg:col-span-4">
          <Leaderboard />
        </div>
      </div>

      {/* Tabs for different dashboard sections */}
      {/* <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:w-auto"> */}
      {/* <TabsTrigger value="pending">Pending Sets</TabsTrigger> */}
      {/* <TabsTrigger value="completed">Completed Sets</TabsTrigger>
                    <TabsTrigger value="progress">My Progress</TabsTrigger> */}
      {/* </TabsList> */}

      {/* <TabsContent value="quizzes" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableQuizzes.map((quiz) => (
                            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>{quiz.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <span>{quiz.subject}</span>
                                        <Badge variant="outline">{quiz.difficulty}</Badge>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Questions</span>
                                            <span>{quiz.questions}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Duration</span>
                                            <span>{quiz.duration} mins</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Due Date</span>
                                            <span>{quiz.dueDate}</span>
                                        </div>
                                        <Button asChild className="w-full mt-4">
                                            <Link href={`/quiz/${quiz.id}`}>Start Quiz</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent> */}

      {/* <TabsContent value="pending" className="space-y-4"> */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Your pending sets</CardDescription>
        </CardHeader>
        <CardContent>
          {questionSetAttempts?.data.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p>No pending quizzes available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questionSetAttempts?.data.map((questionSetAttempt) => {
                const startedAt = formatISODate(
                  questionSetAttempt.startedAt.toString()
                );

                return (
                  <div
                    key={questionSetAttempt.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">
                        {questionSetAttempt.questionSet.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Started on {startedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="text-sm"
                        onClick={() => {
                          router.push(
                            `/question-set-attempt/${questionSetAttempt.id}`
                          );
                          // Handle continue quiz action
                          console.log(
                            `Continue quiz with ID: ${questionSetAttempt.id}`
                          );
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      {/* </TabsContent> */}

      {/* <TabsContent value="completed" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>History</CardTitle>
                            <CardDescription>Your completed sets and scores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {completedQuestionSets.length === 0 ?
                                <div className="flex items-center justify-center h-32 text-muted-foreground">
                                    <p>No completed quizzes available</p>
                                </div>
                                :
                                <div className="space-y-4">
                                    {completedQuestionSets.map((questionSetAttempt) => {
                                        const startedAt = formatISODate(questionSetAttempt.startedAt.toString());
                                        let completedAt = '';
                                        if (questionSetAttempt.completedAt) {
                                            completedAt = formatISODate(questionSetAttempt.completedAt.toString());
                                        } else {
                                            completedAt = 'N/A';
                                        }
                                        return (
                                            <div key={questionSetAttempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <h3 className="font-medium">{questionSetAttempt.questionSet.name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Started on {startedAt}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Completed on {completedAt}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-bold ${questionSetAttempt.score >= 80 ? 'text-green-500' :
                                                        questionSetAttempt.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                                                        }`}>
                                                        {Math.round(questionSetAttempt.percentage)}%
                                                    </span>
                                                    <CheckCircle className={`h-5 w-5 ${questionSetAttempt.score >= 80 ? 'text-green-500' :
                                                        questionSetAttempt.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                                                        }`} /> 

                                                    <Button
                                                        variant="outline"
                                                        className="text-sm"
                                                        onClick={() => {
                                                            router.push(`/question-set-attempt/${questionSetAttempt.id}/results`);
                                                            // Handle view results action
                                                            console.log(`View results for questionSetAttempt ID: ${questionSetAttempt.id}`);
                                                        }}
                                                    >
                                                        View Results
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            }

                        </CardContent>
                    </Card>
                </TabsContent> */}
      {/* </Tabs> */}
    </div>
  );
}
