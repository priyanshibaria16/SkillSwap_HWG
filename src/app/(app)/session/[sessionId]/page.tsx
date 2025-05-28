
import { SessionClient } from "@/components/pages/session/session-client";
import { Suspense } from "react";

// Helper component to make Suspense work with server components reading params/searchParams
function SessionClientWithSuspense({ sessionId }: { sessionId: string }) {
  return <SessionClient sessionId={sessionId} />;
}

export default function SessionPage({ params }: { params: { sessionId: string } }) {
  return (
    <div>
      <Suspense fallback={<div>Loading session details...</div>}>
        <SessionClientWithSuspense sessionId={params.sessionId} />
      </Suspense>
    </div>
  );
}
