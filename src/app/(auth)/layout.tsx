"use client";

import {
  LayoutDashboard,
  BookOpenText,
  HelpCircle,
  Tags,
  Library,
  LineChart,
  ClipboardList,
  ClipboardCheck,
  CreditCard,
  Loader2,
  User,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuthContext } from "@/contexts/AuthContext";
import { Suspense, useEffect, useState } from "react";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { PreferencesModal } from "./(student)/components/preferences-modal";
import { Header } from "@/components/layout/app-header";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard, // More specific than Home for admin dashboards
    role: ["admin", "teacher", "student"],
  },
  {
    title: "Students",
    url: "/students",
    icon: User, // Better for subject management
    role: ["admin"],
  },
  {
    title: "Teachers",
    url: "/teachers",
    icon: User, // Better for subject management
    role: ["admin"],
  },
  {
    title: "Subjects",
    url: "/subjects",
    icon: BookOpenText, // Better for subject management
    role: ["admin"],
  },
  {
    title: "Questions",
    url: "/questions",
    icon: HelpCircle, // More question-specific than FileQuestion
    role: ["admin", "teacher"],
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tags, // Better for categorization
    role: ["admin"],
  },
  {
    title: "Question Banks",
    url: "/question-sets", // Changed URL to match better name
    icon: Library, // Represents collections of questions
    role: ["admin"],
  },
  {
    title: "My Progress",
    url: "/history", // Consider renaming the URL too
    icon: LineChart, // Shows progress better than History
    role: ["student"],
  },
  {
    title: "Practice Tests",
    url: "/explore", // Consider renaming to /practice
    icon: ClipboardList, // Represents tests/exams
    role: ["student"],
  },
  {
    title: "Student Assessments", // More descriptive than "Reviews"
    url: "/reviews",
    icon: ClipboardCheck, // Represents checking/grading
    role: ["admin"],
  },
  {
    title: "Subscription Plans", // More descriptive than "Payments"
    url: "/subscription-plans",
    icon: CreditCard, // Standard for payment/subscriptions
    role: ["admin"],
  },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      window.location.href = "/login";
    }

    // Option 1: Using localStorage
    const hasSeenModal = localStorage.getItem("preferencesModalSeen");

    if (!hasSeenModal && user?.role === "student") {
      if (!user?.hasPreference) {
        setShowPreferences(true);
      } else {
        localStorage.setItem("preferencesModalSeen", "true");
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user?.hasPreference,
    user?.role,
    user?.profilePicture,
  ]);

  const onClose = () => {
    localStorage.setItem("preferencesModalSeen", "true");
    setShowPreferences(false);
  };

  if (user?.role !== "student") {
    return (
      <SidebarProvider>
        <div className="flex bg-gray-50 w-full">
          {/* Sidebar */}
          <AppSidebar
            items={items}
            user={{
              name: user?.name || "John Doe",
              email: user?.email || "john@example.com",
              profilePicture: user?.profilePicture || "",
            }}
            onLogout={logout}
            role={user?.role || ""}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm z-10">
              <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
                <SidebarTrigger />
              </div>
            </header>

            {/* Main content with proper padding */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <Suspense fallback={<Loader2 className="" />}>
                {children}
              </Suspense>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SubscriptionProvider>
      <SidebarProvider>
        <div className="flex bg-gray-50 w-full">
          {/* Sidebar */}
          <AppSidebar
            items={items}
            user={{
              name: user?.name || "John Doe",
              email: user?.email || "john@example.com",
              profilePicture: user?.profilePicture || "",
            }}
            onLogout={logout}
            role={user?.role || ""}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header with sidebar trigger */}
            {user?.role === "student" && <Header />}

            {/* Main content with proper padding */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <Suspense fallback={<Loader2 className="" />}>
                {children}

                {user?.role === "student" && (
                  <PreferencesModal open={showPreferences} onClose={onClose} />
                )}
              </Suspense>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SubscriptionProvider>
  );
}
