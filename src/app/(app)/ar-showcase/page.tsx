import { PageHeader } from "@/components/shared/page-header";
import { ARShowcaseClient } from "@/components/pages/ar-showcase/ar-showcase-client";

export default function ARShowcasePage() {
  return (
    <div>
      <PageHeader
        title="AR Product Showcase"
        description="Upload your product images, classify them with AI, and generate AR demo suggestions."
      />
      <ARShowcaseClient />
    </div>
  );
}
