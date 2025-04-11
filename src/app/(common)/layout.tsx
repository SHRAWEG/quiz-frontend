// app/dashboard/layout.tsx
'use client'

import AdminLayout from '@/app/(admin)/layout'
import StudentLayout from '@/app/(student)/layout'
import TeacherLayout from '@/app/(teacher)/layout'
import FullPageLoader from '@/components/ui/full-page-loader'
import { useUser } from '@/hooks/useUser'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { role, isLoading } = useUser();

  if (isLoading) return <FullPageLoader />

  const LayoutWrapper = {
    Admin: AdminLayout,
    Teacher: TeacherLayout,
    Student: StudentLayout,
  }[role as string] ?? (() => <FullPageLoader />)

  return (
      <LayoutWrapper>{children}</LayoutWrapper>
  )
}