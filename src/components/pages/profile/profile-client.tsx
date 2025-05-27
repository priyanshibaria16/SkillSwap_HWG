"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star, Edit3, Coins, ShieldCheck, BookUser, Briefcase } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type UserRole = "learner" | "tutor";

export function ProfileClient() {
  const [activeRole, setActiveRole] = useState<UserRole>("learner");
  const [isEditing, setIsEditing] = useState(false);

  // Placeholder data
  const userProfile = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatarUrl: "https://placehold.co/128x128.png",
    bio: "Passionate lifelong learner and experienced pottery tutor. Excited to share skills and learn from others!",
    skills: ["Pottery", "Graphic Design", "Yoga", "Spanish"],
    experience: "5 years teaching Pottery, 3 years as a freelance Graphic Designer.",
    coins: 1250,
    learnerRating: 4.8,
    tutorRating: 4.9,
    sessionsCompleted: 25,
    badges: ["Top Tutor Q1", "Community Helper", "Fast Learner"],
  };

  const toggleRole = () => {
    setActiveRole(prevRole => (prevRole === "learner" ? "tutor" : "learner"));
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="items-center text-center">
            <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="person avatar" />
              <AvatarFallback>{userProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
            <CardDescription>{userProfile.email}</CardDescription>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsEditing(!isEditing)}>
              <Edit3 className="mr-2 h-4 w-4" />
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center space-x-2 my-4">
              <Label htmlFor="role-switch" className="text-sm font-medium">
                Learner
              </Label>
              <Switch
                id="role-switch"
                checked={activeRole === "tutor"}
                onCheckedChange={toggleRole}
                aria-label="Switch role between Learner and Tutor"
              />
              <Label htmlFor="role-switch" className="text-sm font-medium">
                Tutor
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Current role: <Badge variant="secondary" className="capitalize">{activeRole}</Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Coins className="text-yellow-500" /> Gamification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Coin Balance:</span>
              <span className="font-bold text-lg text-primary">{userProfile.coins}</span>
            </div>
            <div>
              <Label className="text-sm">Level Progress (Next Badge):</Label>
              <Progress value={(userProfile.sessionsCompleted % 10) * 10} className="h-2 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">{userProfile.sessionsCompleted % 10}/10 sessions to next badge</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Badges Earned:</Label>
              <div className="flex flex-wrap gap-1">
                {userProfile.badges.map(badge => <Badge key={badge} variant="outline">{badge}</Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="text-primary" /> About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md min-h-[100px]"
                defaultValue={userProfile.bio}
              />
            ) : (
              <p className="text-muted-foreground">{userProfile.bio}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Skills & Expertise
            </CardTitle>
            <CardDescription>Skills you offer as a tutor and skills you want to learn.</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing && (
              <div className="mb-4">
                <Label htmlFor="skills-input">Add or Edit Skills (comma separated)</Label>
                <Input id="skills-input" defaultValue={userProfile.skills.join(", ")} />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map(skill => (
                <Badge key={skill} variant="default" className="text-sm py-1 px-3">{skill}</Badge>
              ))}
            </div>
            <Separator className="my-4" />
            <h4 className="font-semibold mb-2">Experience:</h4>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md"
                defaultValue={userProfile.experience}
              />
            ) : (
             <p className="text-sm text-muted-foreground">{userProfile.experience}</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Star className="text-yellow-400" /> Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <h4 className="font-semibold flex items-center gap-1"><BookUser className="h-5 w-5" /> As Learner:</h4>
                <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.round(userProfile.learnerRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">({userProfile.learnerRating.toFixed(1)})</span>
                </div>
            </div>
            <div>
                <h4 className="font-semibold flex items-center gap-1"><Briefcase className="h-5 w-5" /> As Tutor:</h4>
                <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.round(userProfile.tutorRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">({userProfile.tutorRating.toFixed(1)})</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
