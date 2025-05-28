
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
import { Star, Edit3, Coins, ShieldCheck, BookUser, Briefcase, Loader2, Camera, PlusCircle, ListChecks } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

type UserRole = "learner" | "tutor";

export function ProfileClient() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>("learner");
  const { toast } = useToast();

  // Form data states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("Passionate lifelong learner and experienced tutor. Excited to share skills and learn from others!");
  const [skills, setSkills] = useState("Pottery, Graphic Design, Yoga, Spanish");
  const [experience, setExperience] = useState("5 years teaching Pottery, 3 years as a freelance Graphic Designer.");
  const [avatarFallback, setAvatarFallback] = useState("P");

  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User-specific data states (replacing staticProfileData)
  const [coins, setCoins] = useState(0); // Will initialize to 0, or fetched data later
  const [learnerRating, setLearnerRating] = useState(0.0);
  const [tutorRating, setTutorRating] = useState(0.0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setDisplayName(user.displayName || "");
        setImagePreview(user.photoURL); // Set image preview from Firebase Auth
        // TODO: Fetch coins, ratings, sessions, badges, bio, skills, experience from Firestore
        // For now, using defaults or previously set state for bio, skills, experience
        // and default initial values for new gamification/rating states.
        // Example:
        // setCoins(fetchedUserData.coins || 0);
        // setBio(fetchedUserData.bio || "Default bio if not set");
        // setSkills(fetchedUserData.skills || "Default skills if not set");
        // etc.
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const nameForFallback = displayName || (currentUser?.displayName) || "User";
    setAvatarFallback(
      (nameForFallback.charAt(0) || "S") +
      (nameForFallback.split(' ')[1]?.charAt(0) || (nameForFallback.charAt(1) || "K")).toUpperCase()
    );
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
        // Reset image preview to current auth URL if not saved from previous edit session
        setImagePreview(currentUser.photoURL || null);
        setSelectedFile(null);
        // TODO: Re-fetch other editable fields (bio, skills, experience) from their source (e.g. Firestore)
        // to ensure user edits on fresh data if they cancel and re-edit.
        // For now, they edit the current local state.
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

    // TODO: Implement actual photo upload to Firebase Storage
    // For now, this part is conceptual. Actual upload needs Firebase Storage integration.
    if (selectedFile) {
      messages.push("Profile picture selected (upload not implemented yet).");
      // In a real scenario:
      // const newPhotoURL = await uploadProfilePicture(selectedFile, currentUser.uid); // This function would upload to Firebase Storage
      // if (newPhotoURL) {
      //   profileUpdates.photoURL = newPhotoURL;
      //   setImagePreview(newPhotoURL); // Update preview with the new URL from storage
      // }
    } else if (imagePreview === null && currentUser.photoURL !== null) {
      // If user cleared the image preview and there was a photoURL, this implies removal
      // profileUpdates.photoURL = null; // Set to null to remove photo in Firebase Auth (if desired)
      messages.push("Profile picture cleared locally (update in Firebase Auth not fully implemented for removal).");
    }


    if (profileUpdates.displayName || profileUpdates.photoURL !== undefined) {
      try {
        await updateProfile(currentUser, profileUpdates);
        if(profileUpdates.displayName) messages.push("Display name updated.");
        if(profileUpdates.photoURL) messages.push("Profile picture updated in Firebase Auth.");
        // If photo upload were implemented and successful:
        // setSelectedFile(null); 
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({ variant: "destructive", title: "Update Failed", description: "Could not save your Firebase Auth profile." });
        setIsSaving(false);
        return;
      }
    }
    
    // TODO: Save other fields (bio, skills, experience, coins, etc.) to Firestore
    // For example: await updateFirestoreProfile(currentUser.uid, { bio, skills, experience });
    // This would typically happen here. For now, we'll just acknowledge potential changes.
    if (bio !== "Passionate lifelong learner and experienced tutor. Excited to share skills and learn from others!" /* check against initial/fetched bio */) {
        messages.push("Bio updated locally.");
    }
    if (skills !== "Pottery, Graphic Design, Yoga, Spanish" /* check against initial/fetched skills */) {
        messages.push("Skills updated locally.");
    }
    if (experience !== "5 years teaching Pottery, 3 years as a freelance Graphic Designer." /* check against initial/fetched experience */) {
        messages.push("Experience updated locally.");
    }


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

  const handleAddCoins = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "Payment gateway integration for adding coins is not yet implemented.",
    });
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
             <Button variant="outline" size="sm" className="w-full" onClick={handleAddCoins}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Coins
            </Button>
            <Separator />
            <div>
              <Label className="text-sm">Level Progress (Next Badge):</Label>
              <Progress value={(sessionsCompleted % 10) * 10} className="h-2 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">{sessionsCompleted > 0 ? `${sessionsCompleted % 10}/10 sessions to next badge` : "Complete sessions to earn badges!"}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Badges Earned:</Label>
              {badges.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {badges.map(badge => <Badge key={badge} variant="outline">{badge}</Badge>)}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No badges earned yet.</p>
              )}
            </div>
            <Separator />
             <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><ListChecks className="h-4 w-4 text-muted-foreground"/>Transaction History</h4>
                <p className="text-xs text-muted-foreground text-center py-2">Transaction history coming soon.</p>
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
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <h4 className="font-semibold flex items-center gap-1"><BookUser className="h-5 w-5" /> As Learner:</h4>
                {learnerRating > 0 ? (
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
                <h4 className="font-semibold flex items-center gap-1"><Briefcase className="h-5 w-5" /> As Tutor:</h4>
                 {tutorRating > 0 ? (
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
      </div>
    </div>
  );
}
