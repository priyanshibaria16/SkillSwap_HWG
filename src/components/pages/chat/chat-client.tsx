
"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, ArrowLeft, MessageCircle, Info } from "lucide-react";
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
  const router = useRouter();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [pageTitle, setPageTitle] = useState("Chat");
  const [pageDescription, setPageDescription] = useState("Loading chat details...");
  const [partnerDisplayName, setPartnerDisplayName] = useState("Partner");

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const isSkillInquiry = barterRequestId && barterRequestId.startsWith("skillinquiry_");

  useEffect(() => {
    let initialMessages: Message[] = [];
    const currentPartnerName = searchParams.get("partnerName") || "Partner";
    setPartnerDisplayName(currentPartnerName);

    if (isSkillInquiry) {
      const skillNameParam = searchParams.get("skillName") || "a skill";
      setPageTitle(`Chat with ${currentPartnerName}`);
      setPageDescription(`Regarding skill: ${decodeURIComponent(skillNameParam)} (Inquiry ID: ${barterRequestId})`);
      initialMessages = [
        { id: "1", sender: "Partner", text: `Hi! Thanks for your interest in ${decodeURIComponent(skillNameParam)}. How can I help you?`, timestamp: new Date(Date.now() - 1000 * 60 * 2), avatar: "https://placehold.co/40x40.png", fallback: currentPartnerName.charAt(0) || "P" },
        { id: "2", sender: "Self", text: "Hello! I was looking at your skill and had a few questions.", timestamp: new Date(Date.now() - 1000 * 60 * 1), avatar: "https://placehold.co/40x40.png", fallback:"S" },
      ];
    } else {
      // Existing barter request logic
      const skillOfferedParam = searchParams.get("skillOffered") || "a skill";
      const skillRequestedParam = searchParams.get("skillRequested") || "another skill";
      setPageTitle(`Chat with ${currentPartnerName}`);
      setPageDescription(`Regarding your barter: ${decodeURIComponent(skillOfferedParam)} for ${decodeURIComponent(skillRequestedParam)}. Barter ID: ${barterRequestId}`);
      initialMessages = [
        { id: "1", sender: "Partner", text: `Hey! Interested in your offer: ${decodeURIComponent(skillOfferedParam)} for my ${decodeURIComponent(skillRequestedParam)}.`, timestamp: new Date(Date.now() - 1000 * 60 * 5), avatar: "https://placehold.co/40x40.png", fallback: currentPartnerName.charAt(0) || "P" },
        { id: "2", sender: "Self", text: "Hi there! Yes, I'm definitely interested in discussing this further.", timestamp: new Date(Date.now() - 1000 * 60 * 3), avatar: "https://placehold.co/40x40.png", fallback:"S" },
      ];
    }
    setMessages(initialMessages);
  }, [searchParams, barterRequestId, isSkillInquiry]);

  useEffect(() => {
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
      avatar: "https://placehold.co/40x40.png", 
      fallback: "S" 
    };
    setMessages((prevMessages) => [...prevMessages, msg]);
    setNewMessage("");
  };

  const backLink = isSkillInquiry ? "/search" : "/bookings";

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,100px)-2rem)] max-w-3xl mx-auto">
      <PageHeader
        title={pageTitle}
        description={<span className="flex items-center gap-1"><Info className="h-4 w-4 text-muted-foreground"/> {pageDescription}</span>}
        actions={
          <Button variant="outline" onClick={() => router.push(backLink)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {isSkillInquiry ? "Search" : "Bookings"}
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
                    <AvatarImage src={msg.avatar} alt={partnerDisplayName} data-ai-hint="person avatar" />
                    <AvatarFallback>{msg.fallback || partnerDisplayName.charAt(0)}</AvatarFallback>
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
