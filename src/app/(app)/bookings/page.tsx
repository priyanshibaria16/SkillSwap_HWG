import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle, Clock, MessageSquare, RefreshCw, XCircle, Hourglass } from "lucide-react";
import Image from "next/image";

const upcomingSessions = [
  {
    id: "s1",
    skill: "Advanced Pottery",
    tutor: "Alice W.",
    date: "2024-08-15",
    time: "10:00 AM",
    status: "Confirmed",
    image: "https://img.freepik.com/free-vector/collection-people-making-pottery_52683-16219.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740",
    preview: "https://img.freepik.com/premium-vector/pottery-hand-made-hobby-workshop-craft-steps-illustration-graphic-design-concept_385073-439.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740",
    dataAiHint: "pottery class",
  },
  {
    id: "s2",
    skill: "Spanish Conversation",
    learner: "Self",
    date: "2024-08-18",
    time: "02:00 PM",
    status: "Confirmed",
    image: "https://img.freepik.com/free-vector/hand-drawn-spanish-language-illustration_23-2149598250.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740",
    preview: "https://img.freepik.com/free-vector/group-people-talking-different-languages_23-2148373670.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740",
    dataAiHint: "language study",
  },
];

const barterRequests = [
  {
    id: "b1",
    skillOffered: "Graphic Design Basics",
    skillRequested: "Yoga for Beginners",
    fromUser: "Charlie B.",
    status: "Pending",
    image: "https://placehold.co/80x80.png",
    dataAiHint: "graphic design",
  },
  {
    id: "b2",
    skillOffered: "Baking Sourdough",
    skillRequested: "Introduction to Coding",
    toUser: "Diana P.",
    status: "Accepted",
    image: "https://placehold.co/80x80.png",
    dataAiHint: "baking bread",
  },
  {
    id: "b3",
    skillOffered: "Guitar Lessons",
    skillRequested: "Digital Marketing",
    fromUser: "Edward S.",
    status: "Declined",
    image: "https://placehold.co/80x80.png",
    dataAiHint: "guitar music",
  },
];

export default function BookingsPage() {
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

        {/* --- Upcoming Sessions --- */}
        <TabsContent value="upcoming">
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            {upcomingSessions.length > 0 ? upcomingSessions.map(session => (
              <Card key={session.id} className="shadow-md">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Image
                      src={session.image}
                      alt={session.skill}
                      width={64}
                      height={64}
                      className="rounded-md h-16 w-16 object-cover"
                      data-ai-hint={session.dataAiHint}
                    />
                    <div>
                      <CardTitle>{session.skill}</CardTitle>
                      <CardDescription>With {session.tutor || session.learner}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    {session.date} at {session.time}
                  </p>
                  <p className="flex items-center text-sm">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Status: {session.status}
                  </p>

                  {/* Optional preview image */}
                  {session.preview && (
                    <div>
                      <Image
                        src={session.preview}
                        alt="Session Preview"
                        width={200}
                        height={120}
                        className="rounded-md object-cover"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Preview of session</p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="gap-2">
                  <Button variant="default" size="sm">Join Session</Button>
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Cancel</Button>
                </CardFooter>
              </Card>
            )) : (
              <p className="col-span-full text-center text-muted-foreground py-8">No upcoming sessions.</p>
            )}
          </div>
        </TabsContent>

        {/* --- Barter Requests --- */}
        <TabsContent value="barters">
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            {barterRequests.length > 0 ? barterRequests.map(request => (
              <Card key={request.id} className="shadow-md">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Image
                      src={request.image}
                      alt={request.skillOffered}
                      width={64}
                      height={64}
                      className="rounded-md h-16 w-16 object-cover"
                      data-ai-hint={request.dataAiHint}
                    />
                    <div>
                      <CardTitle className="text-base">Barter: {request.skillOffered}</CardTitle>
                      <CardDescription>For: {request.skillRequested}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-sm">
                    {request.fromUser ? `From: ${request.fromUser}` : `To: ${request.toUser}`}
                  </p>
                  <p className="flex items-center text-sm">
                    {request.status === "Pending" && <Hourglass className="mr-2 h-4 w-4 text-yellow-500" />}
                    {request.status === "Accepted" && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                    {request.status === "Declined" && <XCircle className="mr-2 h-4 w-4 text-red-500" />}
                    Status: {request.status}
                  </p>
                </CardContent>

                <CardFooter className="gap-2 flex-wrap">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                  {request.status === "Pending" && request.fromUser && (
                    <>
                      <Button variant="default" size="sm">Accept</Button>
                      <Button variant="destructive" size="sm">Decline</Button>
                    </>
                  )}
                  {request.status === "Pending" && request.toUser && (
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Withdraw
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )) : (
              <p className="col-span-full text-center text-muted-foreground py-8">No barter requests.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
