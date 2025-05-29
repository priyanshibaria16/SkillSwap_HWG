
"use client";

import { useState, useEffect, type ChangeEvent, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Edit3, Coins, ShieldCheck, BookUser, Briefcase, Loader2, Camera, PlusCircle, ListChecks, TrendingUp, TrendingDown, Award, CheckBadge } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

type UserRole = "learner" | "tutor";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: 'credit' | 'debit';
}

interface AssessedSkill {
  id: string;
  skillName: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  date: Date;
}


export function ProfileClient() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>("learner");
  const { toast } = useToast();

  // Form data states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState(""); // Comma-separated
  const [experience, setExperience] = useState("");
  const [avatarFallback, setAvatarFallback] = useState("P");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gamification states
  const [coins, setCoins] = useState(0);
  const [learnerRating, setLearnerRating] = useState(0.0);
  const [tutorRating, setTutorRating] = useState(0.0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);

  // Assessed Skills (Placeholder for now)
  const [assessedSkills, setAssessedSkills] = useState<AssessedSkill[]>([
    { id: 'assess1', skillName: 'Advanced Pottery', level: 'Intermediate', date: new Date(Date.now() - 86400000 * 2) }, // 2 days ago
    { id: 'assess2', skillName: 'Conversational Spanish', level: 'Beginner', date: new Date(Date.now() - 86400000 * 5) }, // 5 days ago
  ]);


  const defaultBio = "Passionate lifelong learner and experienced tutor. Excited to share skills and learn from others!";
  const defaultSkills = "Pottery, Graphic Design, Yoga, Spanish";
  const defaultExperience = "5 years teaching Pottery, 3 years as a freelance Graphic Designer.";

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setDisplayName(user.displayName || "");
        setImagePreview(user.photoURL);
        
        setBio(prev => prev || defaultBio);
        setSkills(prev => prev || defaultSkills);
        setExperience(prev => prev || defaultExperience);
        
        setCoins(0); 
        setSessionsCompleted(0); 
        setLearnerRating(0.0);
        setTutorRating(0.0);
        setBadges([]); 
        setTransactionHistory([
          {
            id: new Date().toISOString() + Math.random().toString(36).substring(2, 7) + 'start', 
            description: "Starting Balance",
            amount: 0, 
            date: new Date(),
            type: 'credit' as 'credit',
          }
        ]);

        if (localStorage.getItem('skillswap_session_just_completed') === 'true') {
          handleSimulateSessionCompletion(); 
          localStorage.removeItem('skillswap_session_just_completed');
        }

      } else {
        setCurrentUser(null);
        setDisplayName("");
        setBio(defaultBio);
        setSkills(defaultSkills);
        setExperience(defaultExperience);
        setImagePreview(null);
        setCoins(0);
        setSessionsCompleted(0);
        setLearnerRating(0.0);
        setTutorRating(0.0);
        setBadges([]);
        setTransactionHistory([]);
        setAssessedSkills([ 
            { id: 'assess1', skillName: 'Advanced Pottery', level: 'Intermediate', date: new Date(Date.now() - 86400000 * 2) },
            { id: 'assess2', skillName: 'Conversational Spanish', level: 'Beginner', date: new Date(Date.now() - 86400000 * 5) },
        ]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []); 

  useEffect(() => {
    const nameForFallback = displayName || (currentUser?.displayName) || "User";
    const nameParts = nameForFallback.split(' ');
    let fallback = (nameParts[0]?.charAt(0) || "S").toUpperCase();
    if (nameParts.length > 1) {
      fallback += (nameParts[nameParts.length - 1]?.charAt(0) || "").toUpperCase();
    } else if (nameForFallback.length > 1) {
      fallback += (nameForFallback.charAt(1) || "").toUpperCase();
    } else {
      fallback += (nameForFallback.charAt(0) || "K").toUpperCase(); 
    }
    setAvatarFallback(fallback);
  }, [currentUser, displayName]);


  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) { 
      handleSaveProfile();
    } else { 
      if (currentUser) {
        setDisplayName(currentUser.displayName || "");
        setBio(bio || defaultBio); // Keep current edited bio or default
        setSkills(skills || defaultSkills); // Keep current edited skills or default
        setExperience(experience || defaultExperience); // Keep current edited experience or default
        setImagePreview(currentUser.photoURL || imagePreview); // Keep current preview or Firebase one
        setSelectedFile(null); 
      }
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to update your profile." });
      return;
    }
    setIsSaving(true);

    let profileUpdates: { displayName?: string; photoURL?: string | null } = {};
    let messages: string[] = [];

    if (displayName !== (currentUser.displayName || "")) {
      profileUpdates.displayName = displayName;
    }
    
    if (profileUpdates.displayName) {
      try {
        await updateProfile(currentUser, { displayName: profileUpdates.displayName });
        messages.push("Display name updated.");
      } catch (error) {
        console.error("Error updating display name:", error);
        toast({ variant: "destructive", title: "Update Failed", description: "Could not save your display name." });
        setIsSaving(false);
        return;
      }
    }
    
    if (selectedFile) {
        messages.push("Profile picture selected (upload not implemented).");
    }
    
    // Other fields like bio, skills, experience, and ratings are updated in local state
    // Their persistence would require Firestore integration.
    messages.push("Other profile details updated (locally).");


    if (messages.length > 0) {
      toast({ title: "Profile Updated", description: messages.join(" ") });
    } else {
      toast({ title: "No Changes", description: "No changes were detected to save." });
    }

    setIsEditing(false);
    setIsSaving(false);
  };

  const toggleRole = () => {
    setActiveRole(prevRole => (prevRole === "learner" ? "tutor" : "learner"));
  };

  const handleSimulateSessionCompletion = () => {
    const rewardAmount = 20;
    setSessionsCompleted(prev => prev + 1);
    setCoins(prevCoins => prevCoins + rewardAmount);
    setTransactionHistory(prevHistory => [
      {
        id: new Date().toISOString() + Math.random().toString(36).substring(2, 15),
        description: "Session Completion Reward",
        amount: rewardAmount,
        date: new Date(),
        type: 'credit' as 'credit',
      },
      ...prevHistory,
    ].sort((a,b) => b.date.getTime() - a.date.getTime()));
    toast({
      title: "Session Completed!",
      description: `You earned ${rewardAmount} coins.`,
    });

    if ((sessionsCompleted + 1) % 10 === 0 && (sessionsCompleted + 1) > 0) {
      const newBadge = `Badge Tier ${(sessionsCompleted + 1) / 10}`;
      if (!badges.includes(newBadge)) {
        setBadges(prevBadges => [...prevBadges, newBadge]);
         toast({
            title: "New Badge Unlocked!",
            description: `Congratulations, you earned: ${newBadge}`,
        });
      }
    }
  };
  
  const handleRatingChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    const newRating = parseFloat(value);
    if (!isNaN(newRating) && newRating >= 0 && newRating <= 5) {
      setter(newRating);
    } else if (value === "") {
      setter(0); // Or some other default if empty
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
        <div className="text-center py-10">
            <p>Please sign in to view your profile.</p>
            <Button onClick={() => window.location.href = '/auth/signin'} className="mt-4">Sign In</Button>
        </div>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="items-center text-center">
            <div className="relative">
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary shadow-md">
                <AvatarImage src={imagePreview || "https://placehold.co/128x128.png"} alt={displayName || "User"} data-ai-hint="person avatar" />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-3 right-[-5px] rounded-full h-9 w-9 bg-background hover:bg-muted border-2 border-primary shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change profile picture"
                  disabled={isSaving}
                >
                  <Camera className="h-5 w-5 text-primary" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              )}
            </div>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              disabled={isSaving}
            />
            {isEditing ? (
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="text-2xl font-semibold text-center h-auto p-1 border-0 border-b-2 border-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors"
                disabled={isSaving}
              />
            ) : (
              <CardTitle className="text-2xl">{displayName || currentUser?.displayName || "User Name"}</CardTitle>
            )}
            <CardDescription className="truncate max-w-xs">{currentUser?.email}</CardDescription>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleEditToggle} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Edit3 className="mr-2 h-4 w-4" />}
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
                disabled={isEditing || isSaving}
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
            <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Coins className="text-yellow-500" /> Coins & Gamification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Coin Balance:</span>
              <span className="font-bold text-lg text-primary">{coins}</span>
            </div>
            
            <Separator />
            <div>
              <Label className="text-sm">Level Progress (Next Badge): {sessionsCompleted} sessions completed</Label>
              <Progress value={sessionsCompleted > 0 ? (sessionsCompleted % 10) * 10 : 0} className="h-2 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">{sessionsCompleted > 0 && sessionsCompleted % 10 !== 0 ? `${10 - (sessionsCompleted % 10)} sessions to next badge` : "Complete sessions to earn badges!"}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Badges Earned:</Label>
              {badges.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {badges.map(badge => <Badge key={badge} variant="outline">{badge}</Badge>)}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No badges earned yet. Complete sessions!</p>
              )}
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><ListChecks className="h-4 w-4 text-muted-foreground"/>Transaction History</h4>
              {transactionHistory.length > 1 ? ( 
                <ScrollArea className="h-[150px] w-full rounded-md border p-2 bg-muted/30">
                  <div className="space-y-3">
                    {transactionHistory.filter(tx => tx.description !== "Starting Balance" || transactionHistory.length === 1).map((tx) => (
                      <div key={tx.id} className="flex justify-between items-start p-2 rounded-md hover:bg-muted/50 text-sm gap-2">
                        <div className="flex-grow">
                          <p className="font-medium leading-tight">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{format(tx.date, "MMM d, yyyy 'at' h:mm a")}</p>
                        </div>
                        <div className={`flex items-center font-semibold whitespace-nowrap ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'credit' ? <TrendingUp className="mr-1 h-4 w-4 flex-shrink-0" /> : <TrendingDown className="mr-1 h-4 w-4 flex-shrink-0" />}
                          {tx.type === 'credit' ? '+' : ''}{tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No transactions yet. Complete sessions to earn coins!</p>
              )}
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
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[100px]"
                disabled={isSaving}
              />
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">{bio || "No bio provided."}</p>
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
            {isEditing ? (
              <div className="mb-4">
                <Label htmlFor="skills-input">Your Skills (comma separated)</Label>
                <Input 
                  id="skills-input" 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., Pottery, Coding, Spanish"
                  disabled={isSaving}
                />
              </div>
            ) : (
               <div className="flex flex-wrap gap-2">
                {skills.split(',').map(skill => skill.trim()).filter(skill => skill).length > 0 ?
                  skills.split(',').map(skill => skill.trim()).filter(skill => skill).map(skill => (
                    <Badge key={skill} variant="default" className="text-sm py-1 px-3">{skill}</Badge>
                  )) : <p className="text-xs text-muted-foreground">No skills listed.</p>}
              </div>
            )}
            <Separator className="my-4" />
            <h4 className="font-semibold mb-2">Experience:</h4>
            {isEditing ? (
              <Textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Describe your experience..."
                className="min-h-[80px]"
                disabled={isSaving}
              />
            ) : (
             <p className="text-sm text-muted-foreground whitespace-pre-wrap">{experience || "No experience described."}</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Star className="text-yellow-400" /> Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <h4 className="font-semibold flex items-center gap-1 mb-2"><BookUser className="h-5 w-5" /> As Learner:</h4>
                {isEditing ? (
                  <div className="space-y-1">
                    <Label htmlFor="learner-rating-input" className="text-xs">Edit Rating (0-5)</Label>
                    <Input
                      id="learner-rating-input"
                      type="number"
                      value={learnerRating.toString()} // Keep as string for controlled input if needed, or bind directly
                      onChange={(e) => handleRatingChange(setLearnerRating, e.target.value)}
                      min="0"
                      max="5"
                      step="0.1"
                      className="h-9"
                      disabled={isSaving}
                    />
                  </div>
                ) : learnerRating > 0 ? (
                    <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.round(learnerRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">({learnerRating.toFixed(1)})</span>
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground mt-1">No ratings yet.</p>
                )}
            </div>
            <div>
                <h4 className="font-semibold flex items-center gap-1 mb-2"><Briefcase className="h-5 w-5" /> As Tutor:</h4>
                {isEditing ? (
                  <div className="space-y-1">
                     <Label htmlFor="tutor-rating-input" className="text-xs">Edit Rating (0-5)</Label>
                    <Input
                      id="tutor-rating-input"
                      type="number"
                      value={tutorRating.toString()}
                      onChange={(e) => handleRatingChange(setTutorRating, e.target.value)}
                      min="0"
                      max="5"
                      step="0.1"
                      className="h-9"
                      disabled={isSaving}
                    />
                  </div>
                ) : tutorRating > 0 ? (
                    <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.round(tutorRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">({tutorRating.toFixed(1)})</span>
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground mt-1">No ratings yet.</p>
                )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="text-primary" /> My Skill Assessments
            </CardTitle>
            <CardDescription>Summary of your assessed skill levels.</CardDescription>
          </CardHeader>
          <CardContent>
            {assessedSkills.length > 0 ? (
              <ul className="space-y-3">
                {assessedSkills.map((assessment) => (
                  <li key={assessment.id} className="p-3 border rounded-md bg-muted/50 hover:bg-muted/75">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-base">{assessment.skillName}</h4>
                      <Badge variant={
                        assessment.level === "Advanced" ? "default" :
                        assessment.level === "Intermediate" ? "secondary" :
                        "outline"
                      } className="capitalize">{assessment.level}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Assessed on: {format(assessment.date, "MMM d, yyyy")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                You haven&apos;t completed any skill assessments yet. Visit a skill page to get started!
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
