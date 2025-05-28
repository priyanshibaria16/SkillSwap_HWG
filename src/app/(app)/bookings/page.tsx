
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, CheckCircle, Clock, MessageSquare, RefreshCw, XCircle, Hourglass, User, ArrowRightLeft, Video, Ban, Edit, Watch } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const initialUpcomingSessions = [
  { id: "s1", skill: "Advanced Pottery", tutor: "Alice W.", date: "2024-08-15", time: "10:00 AM", status: "Confirmed", image: "https://img.freepik.com/free-photo/professional-artisan-job-workshop_23-2148801664.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", dataAiHint: "pottery class" },
  { id: "s2", skill: "Spanish Conversation", learner: "Self", date: "2024-08-18", time: "02:00 PM", status: "Confirmed", image: "https://img.freepik.com/free-vector/couple-talking-different-languages_23-2148386285.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", dataAiHint: "language study" },
];

const initialBarterRequests = [
  { id: "b1", skillOffered: "Graphic Design Basics", fromUser: "Charlie B.", toUser: "Self", status: "Pending", image: "https://img.freepik.com/free-vector/graphic-design-elements-collection_23-2147796019.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", dataAiHint: "graphic design" },
  { id: "b2", skillOffered: "Baking Sourdough", fromUser: "Self", toUser: "Diana P.", status: "Accepted", image: "https://img.freepik.com/free-photo/woman-holds-her-hands-freshly-baked-sourdough-bread_166373-588.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", dataAiHint: "baking" },
  { id: "b3", skillOffered: "Guitar Lessons", fromUser: "Edward S.", toUser: "Self", status: "Declined", image: "https://img.freepik.com/free-photo/man-playing-electric-guitar_23-2148680318.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", dataAiHint: "guitar music" },
  { id: "b4", skillOffered: "French Tutoring", fromUser: "Self", toUser: "Fiona G.", status: "Pending", image: "https://img.freepik.com/free-vector/learning-french-concept-illustration_114360-16502.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", dataAiHint: "language" },
];

export type BarterRequest = typeof initialBarterRequests[0];
export type UpcomingSession = typeof initialUpcomingSessions[0];


export default function BookingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [barterRequests, setBarterRequests] = useState(initialBarterRequests);
  const [upcomingSessions, setUpcomingSessions] = useState(initialUpcomingSessions);

  const [sessionToReschedule, setSessionToReschedule] = useState<UpcomingSession | null>(null);
  const [sessionToCancel, setSessionToCancel] = useState<UpcomingSession | null>(null);

  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleTime, setRescheduleTime] = useState<string>("");

  useEffect(() => {
    if (sessionToReschedule) {
      setRescheduleDate(new Date(sessionToReschedule.date));
      setRescheduleTime(sessionToReschedule.time);
    } else {
      setRescheduleDate(undefined);
      setRescheduleTime("");
    }
  }, [sessionToReschedule]);


  const handleAcceptBarter = (requestId: string) => {
    setBarterRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: "Accepted" } : req
      )
    );
    toast({ title: "Success", description: "Barter request accepted!" });
  };

  const handleDeclineBarter = (requestId: string) => {
    setBarterRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: "Declined" } : req
      )
    );
    toast({ title: "Success", description: "Barter request declined.", variant: "default" });
  };

  const handleWithdrawBarter = (requestId: string) => {
    setBarterRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: "Withdrawn" } : req
      )
    );
    toast({ title: "Success", description: "Barter request withdrawn." });
  };
  
  const handleChat = (request: BarterRequest) => {
    const partnerName = request.fromUser === "Self" ? request.toUser : request.fromUser;
    router.push(`/chat/${request.id}?partnerName=${encodeURIComponent(partnerName)}&skillOffered=${encodeURIComponent(request.skillOffered)}&skillRequested=${encodeURIComponent(request.skillRequested)}`);
  };

  const handleJoinSession = (session: UpcomingSession) => {
    router.push(`/session/${session.id}?skill=${encodeURIComponent(session.skill)}&participant=${encodeURIComponent(session.tutor || session.learner || 'Participant')}`);
  };

  const handleConfirmCancelSession = () => {
    if (sessionToCancel) {
      // Here you would typically call a backend API to cancel the session.
      // For now, we'll just update the local state for demonstration if needed,
      // or simply remove the session from the list.
      setUpcomingSessions(prevSessions => prevSessions.filter(s => s.id !== sessionToCancel.id));
      toast({ title: "Session Cancelled", description: `Your session for ${sessionToCancel.skill} has been cancelled.` });
      setSessionToCancel(null); // Close the dialog
    }
  };

  const handleConfirmReschedule = () => {
    if (sessionToReschedule && rescheduleDate && rescheduleTime) {
      // Here you would typically call a backend API to propose/confirm the reschedule.
      // For now, we'll update the local state.
      setUpcomingSessions(prevSessions => 
        prevSessions.map(s => 
          s.id === sessionToReschedule.id 
          ? { ...s, date: format(rescheduleDate, "yyyy-MM-dd"), time: rescheduleTime, status: "Reschedule Proposed" } 
          : s
        )
      );
      toast({ 
        title: "Reschedule Proposed", 
        description: `Reschedule proposed for ${sessionToReschedule.skill} to ${format(rescheduleDate, "PPP")} at ${rescheduleTime}. The other party will be notified (simulated).` 
      });
      setSessionToReschedule(null); // Close the dialog
    } else {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a new date and time for the session."
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="My Bookings & Barters"
        description="Manage your scheduled sessions and barter requests."
      />
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="barters">Barter Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            {upcomingSessions.length > 0 ? upcomingSessions.map(session => (
              <Card key={session.id} className="shadow-md">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Image src={session.image} alt={session.skill} width={64} height={64} className="rounded-md h-16 w-16 object-cover" data-ai-hint={session.dataAiHint} />
                    <div>
                      <CardTitle>{session.skill}</CardTitle>
                      <CardDescription>With {session.tutor || session.learner}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-center text-sm"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" /> {format(new Date(session.date), "PPP")} at {session.time}</p>
                  <p className="flex items-center text-sm"><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Status: {session.status}</p>
                </CardContent>
                <CardFooter className="gap-2 flex-wrap">
                  <Button variant="default" size="sm" onClick={() => handleJoinSession(session)}>
                    <Video className="mr-2 h-4 w-4" /> Join Session
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={() => setSessionToReschedule(session)}>
                    <Edit className="mr-2 h-4 w-4" /> Reschedule
                  </Button>

                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setSessionToCancel(session)}>
                    <Ban className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </CardFooter>
              </Card>
            )) : <p className="col-span-full text-center text-muted-foreground py-8">No upcoming sessions.</p>}
          </div>
        </TabsContent>
        <TabsContent value="barters">
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            {barterRequests.length > 0 ? barterRequests.map(request => (
              <Card key={request.id} className="shadow-md">
                <CardHeader>
                   <div className="flex items-start gap-4">
                    <Image src={request.image} alt={request.skillOffered} width={64} height={64} className="rounded-md h-16 w-16 object-cover" data-ai-hint={request.dataAiHint} />
                    <div>
                        <CardTitle className="text-base flex items-center">
                           {request.skillOffered} 
                        </CardTitle>
                        <CardDescription>
                           {request.fromUser === "Self" 
                             ? <span className="flex items-center"><User className="mr-1 h-3 w-3"/> To: {request.toUser}</span>
                             : <span className="flex items-center"><User className="mr-1 h-3 w-3"/> From: {request.fromUser}</span>
                           }
                        </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-center text-sm">
                    {request.status === "Pending" && <Hourglass className="mr-2 h-4 w-4 text-yellow-500" />}
                    {request.status === "Accepted" && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                    {request.status === "Declined" && <XCircle className="mr-2 h-4 w-4 text-red-500" />}
                    {request.status === "Withdrawn" && <RefreshCw className="mr-2 h-4 w-4 text-blue-500" />}
                    Status: {request.status}
                  </p>
                </CardContent>
                <CardFooter className="gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleChat(request)}><MessageSquare className="mr-2 h-4 w-4" /> Chat</Button>
                  {request.status === "Pending" && request.toUser === "Self" && ( 
                    <>
                      <Button variant="default" size="sm" onClick={() => handleAcceptBarter(request.id)}>Accept</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeclineBarter(request.id)}>Decline</Button>
                    </>
                  )}
                  {request.status === "Pending" && request.fromUser === "Self" && ( 
                     <Button variant="ghost" size="sm" onClick={() => handleWithdrawBarter(request.id)}><RefreshCw className="mr-2 h-4 w-4" /> Withdraw</Button>
                  )}
                </CardFooter>
              </Card>
            )) : <p className="col-span-full text-center text-muted-foreground py-8">No barter requests.</p>}
          </div>
        </TabsContent>
      </Tabs>

      {/* Reschedule Dialog */}
      <AlertDialog open={!!sessionToReschedule} onOpenChange={(open) => {
        if (!open) setSessionToReschedule(null);
      }}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule Session: {sessionToReschedule?.skill}</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new date and time for your session with {sessionToReschedule?.tutor || sessionToReschedule?.learner}.
              Current: {sessionToReschedule ? `${format(new Date(sessionToReschedule.date), "PPP")} at ${sessionToReschedule.time}` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-1.5">
              <Label htmlFor="reschedule-date">New Date</Label>
              <Calendar
                mode="single"
                selected={rescheduleDate}
                onSelect={setRescheduleDate}
                className="rounded-md border p-0"
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="reschedule-time">New Time (e.g., 02:30 PM)</Label>
              <div className="flex items-center gap-2">
                 <Watch className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSessionToReschedule(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReschedule}>Propose Reschedule</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={!!sessionToCancel} onOpenChange={(open) => !open && setSessionToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Session: {sessionToCancel?.skill}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSessionToCancel(null)}>Keep Session</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancelSession}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
