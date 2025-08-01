import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Clock, Target, ArrowRight, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-xl font-semibold">TaskFlow</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted mb-8">
            <Star className="w-4 h-4 mr-2" />
            Organize. Track. Achieve.
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Your personal
            <br />
            <span className="text-muted-foreground">task companion</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create, organize, and track your tasks with priorities and due
            dates. Stay productive with a clean interface and powerful search
            capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild>
              <Link href="/auth/signup" className="group">
                Start Organizing
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Task Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card className="text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">
                    High Priority
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">
                  Complete Project Proposal
                </CardTitle>
                <CardDescription>
                  Final review and submission - Due today
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">
                    In Progress
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">
                  Team Meeting Prep
                </CardTitle>
                <CardDescription>
                  Prepare slides and agenda items
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Pending</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">Code Review</CardTitle>
                <CardDescription>
                  Review pull requests for new features
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Built for real productivity
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All the essential features you need to manage your tasks
              effectively, without the bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Target className="w-10 h-10 mb-4" />
                <CardTitle>Priority & Status Tracking</CardTitle>
                <CardDescription>
                  Set task priorities (high, medium, low) and track status from
                  pending to in-progress to completed. Stay organized with
                  visual indicators.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-10 h-10 mb-4" />
                <CardTitle>Due Date Management</CardTitle>
                <CardDescription>
                  Set due dates for your tasks and never miss important
                  deadlines. Get a clear overview of what&rsquo;s due and when.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle2 className="w-10 h-10 mb-4" />
                <CardTitle>Search & Filter</CardTitle>
                <CardDescription>
                  Find tasks quickly with powerful search and filtering options.
                  Filter by status, priority, or search by title and
                  description.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Secure & Personalized</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your tasks are private and secure, with multiple ways to sign in
              and personalize your experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle>Multiple Sign-in Options</CardTitle>
                <CardDescription>
                  Sign up with email or use your existing Google or GitHub
                  account. Quick setup, secure authentication, and easy access
                  to your tasks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <CardTitle>Personal Dashboard</CardTitle>
                <CardDescription>
                  View task analytics, track your progress, and manage your
                  profile. Upload a custom avatar and see insights about your
                  productivity.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <Card className="text-center p-12">
            <CardHeader>
              <CardTitle className="text-2xl mb-8">
                What you can do with TaskFlow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold mb-2">Create</div>
                  <div className="text-muted-foreground">
                    Tasks with titles, descriptions, priorities, and due dates
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">Track</div>
                  <div className="text-muted-foreground">
                    Progress from pending to in-progress to completed
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">Organize</div>
                  <div className="text-muted-foreground">
                    Search, filter, and manage all your tasks efficiently
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get organized?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Start managing your tasks effectively. Create, prioritize, and track
            your progress with TaskFlow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup" className="group">
                Create Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-xl font-semibold">TaskFlow</span>
            </div>

            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Support
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2025 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


