
import { ChatClient } from "@/components/pages/chat/chat-client";
import { PageHeader } from "@/components/shared/page-header";
import type { SuspenseProps } from "react";
import { Suspense } from "react";

// Helper component to make Suspense work with server components reading params/searchParams
function ChatClientWithSuspense({ barterRequestId }: { barterRequestId: string }) {
  return <ChatClient barterRequestId={barterRequestId} />;
}


export default function ChatPage({ params }: { params: { barterRequestId: string } }) {
  return (
    <div>
      {/* PageHeader can be used here if needed, or integrated into ChatClient */}
      {/* For now, keeping it simple and letting ChatClient handle its own header */}
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatClientWithSuspense barterRequestId={params.barterRequestId} />
      </Suspense>
    </div>
  );
}

    