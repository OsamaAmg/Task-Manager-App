import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, Target, ArrowRight, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-xl font-semibold">TaskFlow</span>
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
            Simple. Clean. Effective.
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Task management.
            <br />
            <span className="text-muted-foreground">Made simple.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A minimal, distraction-free task manager that helps you focus on what matters. 
            Clean design, powerful organization, zero complexity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild>
              <Link href="/auth/signup" className="group">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Task Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card className="text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Due Today</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">Complete Project Proposal</CardTitle>
                <CardDescription>Final review and submission</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">In Progress</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">Team Meeting Prep</CardTitle>
                <CardDescription>Prepare slides and agenda</CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Planned</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">Code Review</CardTitle>
                <CardDescription>Review pull requests</CardDescription>
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
              Everything you need, nothing you &rsquo;t
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Focus on your tasks with a clean, intuitive interface designed for productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Target className="w-10 h-10 mb-4" />
                <CardTitle>Smart Organization</CardTitle>
                <CardDescription>
                  Organize tasks with categories, priorities, and due dates. 
                  Keep everything structured and easy to find.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="w-10 h-10 mb-4" />
                <CardTitle>Never Miss Deadlines</CardTitle>
                <CardDescription>
                  Track due dates and get gentle reminders. 
                  Stay on top of your schedule without the stress.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CheckCircle2 className="w-10 h-10 mb-4" />
                <CardTitle>Minimal Interface</CardTitle>
                <CardDescription>
                  Clean, distraction-free design that puts your tasks first. 
                  No clutter, just pure productivity.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="text-center p-12">
            <CardHeader>
              <CardTitle className="text-2xl mb-8">Why choose simplicity?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold mb-2">Less</div>
                  <div className="text-muted-foreground">Distractions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">More</div>
                  <div className="text-muted-foreground">Focus</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">Better</div>
                  <div className="text-muted-foreground">Productivity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to simplify your tasks?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Experience the joy of minimal task management. Clean, simple, and effective.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup" className="group">
                Get Started
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
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2025 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}