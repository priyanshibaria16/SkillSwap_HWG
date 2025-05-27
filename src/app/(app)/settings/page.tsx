import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Globe, ShieldQuestion, Trash2 } from "lucide-react";

export default function SettingsPage() {
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
            {/* Add Timezone or other regional settings if needed */}
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
                <Button variant="outline">Change Password</Button>
            </div>
            <Separator />
            <div>
                <h3 className="font-medium mb-1 text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete My Account
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
