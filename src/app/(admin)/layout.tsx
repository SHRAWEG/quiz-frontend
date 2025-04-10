import { Home, FileQuestion, Book, BookText } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useAuthContext } from "@/context/auth-context";
import { useLogout } from "@/hooks/useUser";

export const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Subject",
    url: "#",
    icon: Book,
  },
  {
    title: "Sub Subject",
    url: "#",
    icon: BookText,
  },
  {
    title: "Question",
    url: "#",
    icon: FileQuestion,
  }
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const { name, email } = useAuthContext();

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar items={items} user={{
          name: name || "John Doe",
          email: email || "john@example.com"
        }}
          onLogout={useLogout()} />
        <div className="flex-1">
          <SidebarTrigger />
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
}