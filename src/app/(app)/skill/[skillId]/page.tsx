
import { PageHeader } from "@/components/shared/page-header";
import { SkillAssessmentClient } from "@/components/pages/skill-assessment/skill-assessment-client";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Helper component to make Suspense work with server components reading params
function SkillAssessmentClientWithSuspense({ skillId }: { skillId: string }) {
  return <SkillAssessmentClient skillId={skillId} />;
}

export default function SkillDetailPage({ params }: { params: { skillId: string } }) {
  // Log the skillId on the server side
  console.log("[SkillDetailPage Server Component] Received params.skillId:", params.skillId);

  if (!params.skillId) {
    return (
      <div>
        <PageHeader title="Error" description="No skill ID provided in the URL." />
        <Button asChild className="mt-4">
          <Link href="/search">Go Back to Search</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[200px]">Loading skill details...</div>}>
        <SkillAssessmentClientWithSuspense skillId={params.skillId} />
      </Suspense>
    </div>
  );
}
