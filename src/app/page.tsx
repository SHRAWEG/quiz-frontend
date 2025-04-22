"use client";

import Link from "next/link";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b py-4 px-6 bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h1 className="text-2xl font-bold text-primary">QuizMaster</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Test Your Knowledge with <span className="text-primary">QuizMaster</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Challenge yourself with thousands of quizzes across various categories.
              Learn, compete, and have fun!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/explore">Explore Quizzes</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Quiz Categories</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Quiz Card 1 */}
              <Card>
                <div className="h-40 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center rounded-t-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardHeader>
                  <CardTitle>General Knowledge</CardTitle>
                  <CardDescription>Test your knowledge on various topics with our general knowledge quiz.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/quizzes/general">Explore</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Quiz Card 2 */}
              <Card>
                <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center rounded-t-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <CardHeader>
                  <CardTitle>Science Quiz</CardTitle>
                  <CardDescription>Explore the wonders of science with our challenging science quiz.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/quizzes/science">Explore</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Quiz Card 3 */}
              <Card>
                <div className="h-40 bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center rounded-t-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <CardHeader>
                  <CardTitle>Literature Quiz</CardTitle>
                  <CardDescription>Challenge yourself with questions about famous books and authors.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/quizzes/literature">Explore</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuizMaster?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast-Paced Learning</h3>
                <p className="text-muted-foreground">Our quizzes are designed to make learning fun and efficient.</p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Compete with Friends</h3>
                <p className="text-muted-foreground">Challenge your friends and see who scores the highest.</p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Diverse Categories</h3>
                <p className="text-muted-foreground">Thousands of quizzes across hundreds of topics and categories.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Test Your Knowledge?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Join thousands of users who are already challenging themselves and learning with QuizMaster.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-card text-card-foreground py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                QuizMaster
              </h3>
              <p className="text-muted-foreground mt-2">Test your knowledge, challenge your friends</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
