
"use client"; // Added "use client" for hooks

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Lightbulb, Users, Loader2 } from "lucide-react"; // Added Loader2
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // User is signed in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not signed in, allow landing page to render
        setLoadingAuth(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading SkillSwap...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SkillSwap</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Features</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden"> {/* Added overflow-x-hidden to prevent scrollbars from temp animation overflows */}
        <section className="container py-16 md:py-24 lg:py-32 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl opacity-0 animate-fade-in-up">
            Share Skills, Unlock Potential
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground opacity-0 animate-fade-in-up-delay-1">
            SkillSwap is a vibrant community platform where you can learn new skills, teach what you love, and explore products in augmented reality.
          </p>
          <div className="mt-10 opacity-0 animate-fade-in-up-delay-2">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Explore Skills Now</Link>
            </Button>
          </div>
        </section>

        <section className="bg-muted py-16 md:py-24">
          <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg opacity-0 animate-fade-in-up-delay-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-accent" /> Learn & Grow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Discover a wide range of skills taught by passionate tutors. Learn at your own pace through video sessions or barter your expertise.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg opacity-0 animate-fade-in-up-delay-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-accent" /> Teach & Earn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Share your knowledge and earn coins or cash. Showcase your crafted products with innovative AR + AI powered demonstrations.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg opacity-0 animate-fade-in-up-delay-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-accent" /> Gamified Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Earn coins, climb leaderboards, and unlock badges as you engage with the platform. Make learning and teaching fun!</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="container py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 opacity-0 animate-fade-in-left">
              <h2 className="text-3xl font-bold">Experience Products in AR</h2>
              <p className="mt-4 text-muted-foreground">
                Tutors can showcase their handmade crafts like pottery or clothing using our cutting-edge AR Product Showcase. See products come to life before your eyes!
              </p>
              <Button className="mt-6" asChild>
                <Link href="/ar-showcase">Try AR Showcase</Link>
              </Button>
            </div>
            <div className="md:w-1/2 opacity-0 animate-fade-in-right">
              <Image
                src="https://placehold.co/600x400.png"
                alt="AR Showcase Example"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="augmented reality mobile"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
