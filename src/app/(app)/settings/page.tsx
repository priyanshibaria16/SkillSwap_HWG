
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bell, Globe, ShieldQuestion, Trash2, KeyRound, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User, sendPasswordResetEmail, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleChangePassword = async () => {
    if (!currentUser || !currentUser.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in with a valid email to reset your password.",
      });
      setShowPasswordResetDialog(false);
      return;
    }
    setIsSendingResetEmail(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      toast({
        title: "Password Reset Email Sent",
        description: `A password reset link has been sent to ${currentUser.email}. Please check your inbox.`,
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error.message || "Could not send password reset email. Please try again later.",
      });
    } finally {
      setIsSendingResetEmail(false);
      setShowPasswordResetDialog(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to delete your account." });
      setShowDeleteAccountDialog(false);
      return;
    }
    setIsDeletingAccount(true);
    // Actual account deletion requires recent sign-in (re-authentication) for security.
    // This is a complex flow. For now, we simulate it with a toast and logout.
    // In a real app:
    // 1. Prompt user for password / re-authenticate.
    // 2. Call deleteUser(currentUser).
    // 3. Handle success/failure.

    // Simulate some delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Account Deletion Initiated (Simulated)",
      description: "Your account deletion process has started. You will be logged out.",
    });

    try {
      await signOut(auth);
      router.push("/"); // Redirect to landing page
    } catch (error) {
      console.error("Logout error after simulated deletion:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out after simulated account deletion.",
      });
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteAccountDialog(false);
    }
  };


  return (
    <div>
      <PageHeader
        title="Settings"
        description="Customize your SkillSwap experience."
      />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="text-primary" /> Language & Region</CardTitle>
            <CardDescription>Choose your preferred language for the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language-select">Preferred Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="text-primary" /> Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive notifications from us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-muted/50">
              <Label htmlFor="session-reminders" className="flex flex-col space-y-1">
                <span>Session Reminders</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Get notified before your sessions start.
                </span>
              </Label>
              <Switch id="session-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-muted/50">
              <Label htmlFor="barter-updates" className="flex flex-col space-y-1">
                <span>Barter Request Updates</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive updates on your barter proposals.
                </span>
              </Label>
              <Switch id="barter-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-muted/50">
              <Label htmlFor="platform-news" className="flex flex-col space-y-1">
                <span>Platform News & Updates</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Stay informed about new features and announcements.
                </span>
              </Label>
              <Switch id="platform-news" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldQuestion className="text-primary" /> Account Management</CardTitle>
            <CardDescription>Manage your account settings and security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="font-medium mb-1">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-2">Update your account password regularly for security.</p>
                <Button variant="outline" onClick={() => setShowPasswordResetDialog(true)} disabled={!currentUser || isSendingResetEmail}>
                    {isSendingResetEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                    Send Password Reset Email
                </Button>
            </div>
            <Separator />
            <div>
                <h3 className="font-medium mb-1 text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={() => setShowDeleteAccountDialog(true)} disabled={!currentUser || isDeletingAccount}>
                    {isDeletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete My Account
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <AlertDialog open={showPasswordResetDialog} onOpenChange={setShowPasswordResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              {currentUser?.email ? 
                `A password reset link will be sent to ${currentUser.email}. Click "Send Email" to proceed.` :
                "You need to be logged in with a valid email to reset your password."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPasswordResetDialog(false)} disabled={isSendingResetEmail}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangePassword} disabled={!currentUser?.email || isSendingResetEmail}>
              {isSendingResetEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers (simulated).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAccountDialog(false)} disabled={isDeletingAccount}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Yes, Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

