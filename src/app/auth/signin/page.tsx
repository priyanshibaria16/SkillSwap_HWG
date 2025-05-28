
"use client"; // Added "use client" for hooks

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SigninForm } from "@/components/pages/auth/signin-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Loader2 } from "lucide-react"; // Added Loader2
import Link from "next/link";

export default function SigninPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // User is signed in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not signed in, allow sign-in page to render
        setLoadingAuth(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Gift className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">SkillSwap</span>
          </Link>
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue your SkillSwap journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <SigninForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
