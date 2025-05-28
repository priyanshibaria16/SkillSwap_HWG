
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Gift, LogOut, Search, Settings, UserCircle } from "lucide-react"; // Added LogOut
import Link from "next/link";
import { Input } from "../ui/input";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function AppHeader() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [userDisplayName, setUserDisplayName] = useState("User Name");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [avatarFallback, setAvatarFallback] = useState("UR");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserDisplayName(currentUser.displayName || "User");
        setUserEmail(currentUser.email || "No email");
        setAvatarFallback(
          (currentUser.displayName?.substring(0, 1) || "") +
          (currentUser.displayName?.split(' ')[1]?.substring(0,1) || (currentUser.displayName || "U")[0] || "U").toUpperCase()
        );
      } else {
        setUserDisplayName("User Name");
        setUserEmail("user@example.com");
        setAvatarFallback("UR");
      }
    });
    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/"); // Redirect to landing page after logout
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="lg:hidden" />
          <Link href="/dashboard" className="hidden items-center gap-2 lg:flex">
            <Gift className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SkillSwap</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative hidden sm:block w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search skills, tutors..." className="pl-10" />
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt="User Avatar" data-ai-hint="person avatar" />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
