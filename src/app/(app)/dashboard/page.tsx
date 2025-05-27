import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Search, Users, Box } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome to SkillSwap ARena!"
        description="Your central hub for learning, teaching, and exploring."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              Find New Skills
            </CardTitle>
            <CardDescription>
              Browse a diverse catalog of skills and connect with expert tutors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x400.png" alt="Find Skills" width={600} height={400} className="rounded-md mb-4" data-ai-hint="education learning" />
            <Button asChild className="w-full">
              <Link href="/search">
                Search Skills <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Manage Your Sessions
            </CardTitle>
            <CardDescription>
              View upcoming sessions, manage barter requests, and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Image src="https://placehold.co/600x400.png" alt="Manage Sessions" width={600} height={400} className="rounded-md mb-4" data-ai-hint="calendar schedule" />
            <Button asChild className="w-full">
              <Link href="/bookings">
                My Bookings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-6 w-6 text-primary" />
              AR Product Showcase
            </CardTitle>
            <CardDescription>
              Tutors: Showcase your crafted items with AI-powered AR demos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x400.png" alt="AR Showcase" width={600} height={400} className="rounded-md mb-4" data-ai-hint="augmented reality product" />
            <Button asChild className="w-full">
              <Link href="/ar-showcase">
                Go to Showcase <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
