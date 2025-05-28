
"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";

interface Message {
  id: string;
  sender: "Self" | "Partner";
  text: string;
  timestamp: Date;
  avatar?: string;
  fallback?: string;
}

export function ChatClient({ barterRequestId }: { barterRequestId: string }) {
  const searchParams = useSearchParams();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [partnerName, setPartnerName] = useState("Partner");
  const [skillOffered, setSkillOffered] = useState("");
  const [skillRequested, setSkillRequested] = useState("");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    setPartnerName(searchParams.get("partnerName") || "Partner");
    setSkillOffered(searchParams.get("skillOffered") || "a skill");
    setSkillRequested(searchParams.get("skillRequested") || "another skill");
  }, [searchParams]);

  useEffect(() => {
    // Mock initial messages or fetch them
    setMessages([
      { id: "1", sender: "Partner", text: `Hey! Interested in your offer: ${decodeURIComponent(searchParams.get("skillOffered") || "")} for my ${decodeURIComponent(searchParams.get("skillRequested") || "")}.`, timestamp: new Date(Date.now() - 1000 * 60 * 5), avatar: "https://placehold.co/40x40.png", fallback:"P" },
      { id: "2", sender: "Self", text: "Hi there! Yes, I'm definitely interested in discussing this further.", timestamp: new Date(Date.now() - 1000 * 60 * 3), avatar: "https://placehold.co/40x40.png", fallback:"S" },
    ]);
  }, [searchParams]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: "Self",
      text: newMessage,
      timestamp: new Date(),
      avatar: "https://placehold.co/40x40.png", // Replace with actual current user avatar
      fallback: "S" // Replace with actual current user fallback
    };
    setMessages((prevMessages) => [...prevMessages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,100px)-2rem)] max-w-3xl mx-auto">
      <PageHeader
        title={`Chat with ${partnerName}`}
        description={`Regarding your barter: ${skillOffered} for ${skillRequested}. Barter ID: ${barterRequestId}`}
        actions={
          <Button variant="outline" asChild>
            <Link href="/bookings"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings</Link>
          </Button>
        }
      />
      
      <Card className="flex-grow flex flex-col shadow-lg">
        <CardContent className="p-0 flex-grow flex flex-col">
          <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === "Self" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "Partner" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar} alt={partnerName} data-ai-hint="person avatar" />
                    <AvatarFallback>{msg.fallback || partnerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow ${
                    msg.sender === "Self"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === "Self" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar} alt="My Avatar" data-ai-hint="person avatar"/>
                    <AvatarFallback>{msg.fallback || "Me"}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow"
                aria-label="Chat message input"
              />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    