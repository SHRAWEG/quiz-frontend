'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {
    BookOpen,
    Clock,
    Award,
    BarChart2,
    Calendar,
    TrendingUp,
    CheckCircle
} from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import Link from 'next/link';

export default function StudentDashboard() {
    const [stats, setStats] = useState({
        quizzesTaken: 0,
        averageScore: 0,
        streakDays: 0,
        pendingQuizzes: 0,
    });

    // Mock data - replace with actual API calls
    useEffect(() => {
        setTimeout(() => {
            setStats({
                quizzesTaken: 15,
                averageScore: 82,
                streakDays: 7,
                pendingQuizzes: 3,
            });
        }, 500);
    }, []);

    // Mock quiz data
    // const availableQuizzes = [
    //     {
    //         id: '1',
    //         title: 'Math Fundamentals',
    //         subject: 'Mathematics',
    //         difficulty: 'Beginner',
    //         questions: 10,
    //         duration: 20,
    //         dueDate: '2023-12-15'
    //     },
    //     {
    //         id: '2',
    //         title: 'Science Challenge',
    //         subject: 'Science',
    //         difficulty: 'Intermediate',
    //         questions: 15,
    //         duration: 30,
    //         dueDate: '2023-12-20'
    //     },
    //     {
    //         id: '3',
    //         title: 'History Trivia',
    //         subject: 'History',
    //         difficulty: 'Advanced',
    //         questions: 12,
    //         duration: 25,
    //         dueDate: '2023-12-18'
    //     }
    // ];

    const completedQuizzes = [
        {
            id: '4',
            title: 'Grammar Test',
            score: 92,
            dateCompleted: '2023-12-05'
        },
        {
            id: '5',
            title: 'Geography Quiz',
            score: 78,
            dateCompleted: '2023-11-28'
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Student Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                                <h3 className="text-2xl font-bold">{stats.quizzesTaken}</h3>
                            </div>
                            <BookOpen className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Average Score</p>
                                <h3 className="text-2xl font-bold">{stats.averageScore}%</h3>
                            </div>
                            <Award className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Current Streak</p>
                                <h3 className="text-2xl font-bold">{stats.streakDays} days</h3>
                            </div>
                            <TrendingUp className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Quizzes</p>
                                <h3 className="text-2xl font-bold">{stats.pendingQuizzes}</h3>
                            </div>
                            <Clock className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different dashboard sections */}
            <Tabs defaultValue="completed" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-auto">
                    <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
                    <TabsTrigger value="progress">My Progress</TabsTrigger>
                </TabsList>

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

                <TabsContent value="completed" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz History</CardTitle>
                            <CardDescription>Your completed quizzes and scores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {completedQuizzes.map((quiz) => (
                                    <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-medium">{quiz.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Completed on {quiz.dateCompleted}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${quiz.score >= 80 ? 'text-green-500' :
                                                quiz.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                                                }`}>
                                                {quiz.score}%
                                            </span>
                                            <CheckCircle className={`h-5 w-5 ${quiz.score >= 80 ? 'text-green-500' :
                                                quiz.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                                                }`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Score Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                    <BarChart2 className="h-16 w-16" />
                                    <p className="ml-2">Visualization of your performance over time</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Subject Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                    <BookOpen className="h-16 w-16" />
                                    <p className="ml-2">Your performance by subject area</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Upcoming Quizzes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                                    <Calendar className="h-16 w-16" />
                                    <p className="ml-2">Your scheduled quizzes will appear here</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}