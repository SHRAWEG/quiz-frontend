// app/dashboard/page.tsx
'use client'

import { useAuthContext } from '@/context/auth-context'
import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(() => import('@/app/(admin)/components/dashboard'))
const TeacherDashboard = dynamic(() => import('@/app/(teacher)/components/dashboard'))
const StudentDashboard = dynamic(() => import('@/app/(student)/components/dashboard'))

export default function DashboardPage() {
  const { role } = useAuthContext()

  switch (role) {
    case 'Admin': return <AdminDashboard />
    case 'Teacher': return <TeacherDashboard />
    case 'Student': return <StudentDashboard />
    default: return null // Redirect handled in context
  }
}