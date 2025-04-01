// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navbar (Simple) */}
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">QuizMaster</h1>
        <Link 
          href="/login" 
          className="text-blue-600 hover:underline"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Master <span className="text-blue-600">Quizzes</span>, Unlock Knowledge
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Join thousands of students and teachers revolutionizing learning.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Get Started - It's Free
          </Link>
          <Link
            href="/login"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            I Have an Account
          </Link>
        </div>
      </section>

      {/* Role Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8">
        {/* Student Card */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">For Students</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-2">
              <CheckIcon /> Practice with unlimited quizzes
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon /> Track your progress
            </li>
          </ul>
        </div>

        {/* Teacher Card */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">For Teachers</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-2">
              <CheckIcon /> Create quizzes in minutes
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon /> Analyze student performance
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Simple check icon component
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-green-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
    />
    </svg>
  );
}