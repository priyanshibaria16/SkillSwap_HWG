
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Video, ListVideo, FileText } from "lucide-react";

// Mock session data - in a real app, this would be fetched based on sessionId
const mockSessionDetails = {
  s1: {
    skill: "Advanced Pottery",
    participant: "Alice W.",
    description: "Dive deep into advanced pottery techniques, focusing on glazing and firing. This session will cover various methods to enhance your ceramic creations.",
    videoTutorials: [
      { title: "Introduction to Glazing", intro: "Learn the foundational techniques of applying glaze to your pottery pieces. We'll cover types of glazes, application methods, and safety precautions.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Advanced Firing Methods", intro: "Explore different firing techniques beyond basic bisque and glaze firing. Discover how to achieve unique effects like raku and smoke firing.", url: "https://www.youtube.com/embed/L_jWHffIx5E" },
    ],
  },
  s2: {
    skill: "Spanish Conversation",
    participant: "Self", // Assuming 'Self' is a valid participant name from booking data
    description: "Practice your Spanish conversation skills in a relaxed and supportive environment. Focus on everyday topics and building fluency.",
    videoTutorials: [
      { title: "Common Spanish Greetings & Introductions", intro: "Master essential greetings and how to introduce yourself confidently in Spanish. Includes formal and informal scenarios.", url: "https://www.youtube.com/embed/o_S1iF1FjSs" },
      { title: "Ordering Food in Spanish", intro: "Learn vocabulary and phrases for ordering at a restaurant, from asking for a table to paying the bill. Includes common food items.", url: "https://www.youtube.com/embed/t8LpTMOAdpY" },
    ],
  },
};

type VideoTutorial = {
  title: string;
  intro: string;
  url: string;
};

type SessionDetailsData = {
  skill: string;
  participant: string;
  description: string;
  videoTutorials: Array<VideoTutorial>;
};

export function SessionClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [skillName, setSkillName] = useState("Session");
  const [participantName, setParticipantName] = useState("Participant");
  const [sessionData, setSessionData] = useState<SessionDetailsData | null>(null);

  useEffect(() => {
    const skillQueryParam = searchParams.get("skill");
    const participantQueryParam = searchParams.get("participant");

    const details = mockSessionDetails[sessionId as keyof typeof mockSessionDetails];

    if (details) {
      setSkillName(skillQueryParam || details.skill); // Prefer query param, fallback to mock
      setParticipantName(participantQueryParam || details.participant); // Prefer query param, fallback to mock
      setSessionData(details);
    } else {
      // Fallback if session ID is not in mock data, but we still might have query params
      setSkillName(skillQueryParam || "Unknown Session");
      setParticipantName(participantQueryParam || "Unknown Participant");
      setSessionData({
        skill: skillQueryParam || "Unknown Session",
        participant: participantQueryParam || "Unknown Participant",
        description: "Details for this session are not currently available.",
        videoTutorials: [],
      });
    }
  }, [searchParams, sessionId]);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title={`Session: ${skillName}`}
        description={`With ${participantName}. ID: ${sessionId}`}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
          </Button>
        }
      />

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="text-primary h-6 w-6" />Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{sessionData?.description || "Loading session details..."}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListVideo className="text-primary h-6 w-6" />Session Video Queue</CardTitle>
          <CardDescription>
            Here you'll find video tutorials and other materials for your session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {sessionData && sessionData.videoTutorials.length > 0 ? (
            sessionData.videoTutorials.map((video, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-4">
                    <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="text-xl font-semibold mb-1">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{video.intro}</p>
                    </div>
                </div>
                <div className="aspect-video w-full bg-muted rounded-md overflow-hidden shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="border-0"
                  ></iframe>
                </div>
              </div>
            ))
          ) : sessionData ? ( // Only show "no tutorials" if sessionData is loaded but empty
             <div className="text-center py-8 text-muted-foreground">
                <Video className="mx-auto h-12 w-12 mb-2" />
                <p>No video tutorials available for this session yet.</p>
             </div>
           ) : ( // sessionData is null, meaning it's still in the initial loading state
            <p className="text-muted-foreground">Loading video tutorials...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
