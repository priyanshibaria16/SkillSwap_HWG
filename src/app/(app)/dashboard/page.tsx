import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Search, Box } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome to SkillSwap!"
        description="Your central hub for learning, teaching, and exploring."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {/* Card 1 */}
        <Card className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              Find New Skills
            </CardTitle>
            <CardDescription>
              Browse a diverse catalog of skills and connect with expert tutors.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow justify-between">
            <div>
              <Image
                src="https://dorothydalton.com/wp-content/uploads/2019/05/skills-4.jpg"
                alt="Find Skills"
                width={600}
                height={100}
                className="rounded-md mb-4 object-cover"
              />
            </div>
            <Button asChild className="w-full mt-2">
              <Link href="/search">
                Search Skills <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Manage Your Sessions
            </CardTitle>
            <CardDescription>
              View upcoming sessions, manage barter requests, and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow justify-between">
            <div>
              <Image
                src="https://mojoauth.com/blog/wp-content/uploads/2025/02/sessions_20250213_073145.jpg"
                alt="Manage Sessions"
                width={600}
                height={500}
                className="rounded-md mb-4 object-cover"
              />
            </div>
            <Button asChild className="w-full mt-2">
              <Link href="/bookings">
                My Bookings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-6 w-6 text-primary" />
              AR Product Showcase
            </CardTitle>
            <CardDescription>
              Tutors: Showcase your crafted items with AI-powered AR demos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow justify-between">
            <div>
              <Image
                src="https://i0.wp.com/www.digitalnauts.co.uk/wp-content/uploads/2022/10/MicrosoftTeams-image-3.png?fit=800%2C500&ssl=1"
                alt="AR Showcase"
                width={600}
                height={400}
                className="rounded-md mb-4 object-cover"
              />
            </div>
            <Button asChild className="w-full mt-2">
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
