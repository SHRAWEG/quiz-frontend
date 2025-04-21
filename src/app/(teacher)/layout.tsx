"use client"

import { Home, FileQuestion, Book, BookText } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useLogout, useUser } from "@/hooks/useUser";

export const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Question",
    url: "/questions",
    icon: FileQuestion,
  }
]

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { name, email } = useUser("teacher");
  const logout = useLogout();

  return (
    <SidebarProvider>
      <div className="flex bg-gray-50 w-full">
        {/* Sidebar */}
        <AppSidebar
          items={items}
          user={{
            name: name || "John Doe",
            email: email || "john@example.com"
          }}
          onLogout={logout}
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
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}