'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { useTeacherDashboard } from '@/hooks/api/useDashboard';
import {
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function TeacherDashboard() {
  const { data } = useTeacherDashboard();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Questions Created</p>
                <h3 className="text-2xl font-bold">{data?.totalQuestionsAuthored}</h3>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions Used</p>
                <h3 className="text-2xl font-bold">{data?.totalUsedInQuestionSets}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions Approved</p>
                <h3 className="text-2xl font-bold">{data?.totalApprovedQuestions}</h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different dashboard sections */}
      {/* <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">My Questions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Question Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <LineChart className="h-16 w-16" />
                  <p className="ml-2">How often your questions appear in quizzes</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Question Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <PieChart className="h-16 w-16" />
                  <p className="ml-2">Breakdown of your question types</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <TrendingUp className="h-16 w-16" />
                  <p className="ml-2">Your recent question submissions and approvals</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <p>Table of your questions with status (approved/pending) would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Question Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <p>Analytics on how students perform on your questions would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}