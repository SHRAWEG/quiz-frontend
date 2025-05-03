// app/dashboard/page.tsx
'use client'

import { useUser } from '@/hooks/useUser'
import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(() => import('@/app/(auth)/(admin)/components/dashboard'))
const TeacherDashboard = dynamic(() => import('@/app/(auth)/(teacher)/components/dashboard'))
const StudentDashboard = dynamic(() => import('@/app/(auth)/(student)/components/dashboard'))

export default function DashboardPage() {
  const { role } = useUser()

  switch (role) {
    case 'admin': return <AdminDashboard />
    case 'teacher': return <TeacherDashboard />
    case 'student': return <StudentDashboard />
    default: return null // Redirect handled in context
  }
}