// app/dashboard/page.tsx
'use client'

import { useUser } from '@/hooks/useUser'
import dynamic from 'next/dynamic'

const AdminQuestionList = dynamic(() => import('@/app/(admin)/questions/components/list'))
const TeacherQuestionList = dynamic(() => import('@/app/(teacher)/questions/components/list'))

export default function DashboardPage() {
  const { role } = useUser()

  switch (role) {
    case 'admin': return <AdminQuestionList />
    case 'teacher': return <TeacherQuestionList />
    case 'student': return null // Redirect handled in context
    default: return null // Redirect handled in context
  }
}