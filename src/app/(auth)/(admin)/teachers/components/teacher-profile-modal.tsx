"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { User } from "@/types/user";

interface TeacherProfileModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherProfileModal({ user, open, onOpenChange }: TeacherProfileModalProps) {
  if (!user) return null;

  // Generate dummy data based on user info
  const dummyData = {
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    bio: "Passionate educator with over 8 years of experience in teaching and curriculum development. Dedicated to fostering student growth and academic excellence.",
    address: "123 Education Street, Knowledge City, KC 12345",
    dateOfBirth: "1985-03-15",
    joinDate: "2020-09-01",
    department: "Computer Science",
    qualification: "M.Sc. Computer Science, B.Ed.",
    specialization: ["Data Structures", "Algorithms", "Web Development", "Database Management"],
    stats: {
      totalStudents: 245,
      coursesTeaching: 6,
      averageRating: 4.7,
      completionRate: 92,
      totalQuestions: 1250,
      approvedQuestions: 1180,
    },
    recentActivity: [
      { action: "Created new quiz", subject: "Data Structures", date: "2024-01-15" },
      { action: "Graded assignments", subject: "Algorithms", date: "2024-01-14" },
      { action: "Updated course material", subject: "Web Development", date: "2024-01-12" },
    ],
    achievements: [
      { title: "Best Teacher Award", year: "2023", icon: Award },
      { title: "Innovation in Teaching", year: "2022", icon: Star },
      { title: "Student Choice Award", year: "2021", icon: Users },
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Teacher Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={dummyData.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-2xl">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-muted-foreground">{dummyData.department}</p>
                <Badge variant={user.isActive ? "default" : "secondary"} className="mt-2">
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-muted-foreground">{dummyData.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                  {user.isEmailVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{dummyData.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined: {dummyData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{dummyData.stats.totalStudents}</div>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{dummyData.stats.coursesTeaching}</div>
                <p className="text-sm text-muted-foreground">Courses Teaching</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{dummyData.stats.averageRating}</div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{dummyData.stats.completionRate}%</div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Qualification</label>
                  <p className="text-sm">{dummyData.qualification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dummyData.specialization.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Questions Created</label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Approved: {dummyData.stats.approvedQuestions}</span>
                      <span>Total: {dummyData.stats.totalQuestions}</span>
                    </div>
                    <Progress 
                      value={(dummyData.stats.approvedQuestions / dummyData.stats.totalQuestions) * 100} 
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dummyData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <achievement.icon className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.year}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dummyData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.subject}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
