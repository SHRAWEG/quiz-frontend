"use client"

import { Home, FileQuestion, Book, Loader2, LayoutList } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useAuthContext } from "@/contexts/AuthContext";
import { Suspense, useEffect } from "react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    role: ['admin', 'teacher', 'student']
  },
  {
    title: "Subject",
    url: "/subjects",
    icon: Book,
    role: ["admin"]
  },
  // {
  //   title: "Sub Subject",
  //   url: "/sub-subjects",
  //   icon: BookText,
  //   role: ["admin"]
  // },
  {
    title: "Question",
    url: "/questions",
    icon: FileQuestion,
    role: ["admin", "teacher"]
  },
  {
    title: "Category",
    url: "/categories",
    icon: FileQuestion,
    role: ["admin"]
  },
  {
    title: "Question Set",
    url: "/question-sets",
    icon: FileQuestion,
    role: ["admin"]
  },
  {
    title: "Explore",
    url: "/explore",
    icon: LayoutList,
    role: ["student"]
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: FileQuestion,
    role: ["admin"]
  }
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isLoading, isAuthenticated]);

  return (
    <SidebarProvider>
      <div className="flex bg-gray-50 w-full">
        {/* Sidebar */}
        <AppSidebar
          items={items}
          user={{
            name: user?.name || "John Doe",
            email: user?.email || "john@example.com"
          }}
          onLogout={logout}
          role={user?.role || ""}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with sidebar trigger */}
          <header className="bg-white shadow-sm z-10">
            <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                {/* You can add user dropdown or other header items here */}
              </div>
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