// components/leaderboard.tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { useLeaderBoard } from "@/hooks/api/useDashboard";

export function Leaderboard() {
  const { data: leaderboardData = [], isPending } = useLeaderBoard();

  const currentUser = leaderboardData?.find((user) => user.isCurrentUser);

  if (isPending) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Progress className="w-full" value={50} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader className="px-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              Top Performers
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-6">
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-4">
            {leaderboardData.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex flex-col items-center p-4 rounded-lg border",
                  user.rank === 1
                    ? "bg-gradient-to-b from-amber-100 to-amber-50 border-amber-200"
                    : user.rank === 2
                    ? "bg-gradient-to-b from-slate-100 to-slate-50 border-slate-200"
                    : "bg-gradient-to-b from-rose-100 to-rose-50 border-rose-200",
                  user.isCurrentUser && "ring-2 ring-primary"
                )}
              >
                <div className="relative mb-2">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -top-2 -left-2 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold",
                      user.rank === 1
                        ? "bg-amber-500"
                        : user.rank === 2
                        ? "bg-slate-500"
                        : "bg-rose-500"
                    )}
                  >
                    {user.rank}
                  </div>
                </div>
                <h3 className="font-semibold">{user.name}</h3>
                <div className="text-2xl font-bold text-primary">
                  {user.score}
                </div>
              </div>
            ))}
          </div>

          {/* Full leaderboard table */}
          {leaderboardData.length > 3 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Attempts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map(
                  (user) =>
                    user.rank < 11 && (
                      <TableRow
                        key={user.id}
                        className={cn(
                          user.isCurrentUser && "bg-primary/5 font-medium",
                          user.rank <= 3 && "hidden" // Hide top 3 as they're in the podium
                        )}
                      >
                        <TableCell>
                          <div
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full",
                              user.isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            {user.rank}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                            {user.isCurrentUser && (
                              <Badge variant="secondary">You</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {user.score}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{user.attempts}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          )}

          {/* Current user highlight (if not in top 3) */}
          {currentUser && currentUser.rank > 10 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Your Performance</h3>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                        {currentUser.rank}
                      </div>
                      <div>
                        <h4 className="font-medium">{currentUser.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentUser.attempts} attempt(s)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {currentUser.score}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
