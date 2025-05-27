"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Wand2, Sparkles, PackageSearch, Lightbulb, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

// IMPORTANT: Import AI functions. These are server actions.
import { classifyProductType, type ClassifyProductTypeOutput } from "@/ai/flows/classify-product-type";
import { generateArDemoSuggestion, type GenerateArDemoSuggestionOutput } from "@/ai/flows/generate-ar-demo-suggestion";

type ProcessStep = "idle" | "upload" | "classify" | "suggest" | "done";

export function ARShowcaseClient() {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [productDescription, setProductDescription] = useState<string>("");
  
  const [classificationResult, setClassificationResult] = useState<ClassifyProductTypeOutput | null>(null);
  const [arSuggestion, setArSuggestion] = useState<GenerateArDemoSuggestionOutput | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProcessStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setCurrentStep("upload");
      setError(null);
      setClassificationResult(null);
      setArSuggestion(null);
    }
  };

  const handleClassify = async () => {
    if (!productImage || !productImagePreview || !productDescription) {
      setError("Please upload an image and provide a description.");
      toast({ title: "Error", description: "Please upload an image and provide a description.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentStep("classify");

    try {
      const result = await classifyProductType({
        photoDataUri: productImagePreview,
        description: productDescription,
      });
      setClassificationResult(result);
      toast({ title: "Classification Successful", description: `Product identified as: ${result.productType}` });
    } catch (err) {
      console.error("Classification error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during classification.";
      setError(errorMessage);
      toast({ title: "Classification Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestDemo = async () => {
    if (!productImagePreview || !productDescription || !classificationResult) {
      setError("Please classify the product first.");
      toast({ title: "Error", description: "Please classify the product first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentStep("suggest");

    try {
      const result = await generateArDemoSuggestion({
        productPhotoDataUri: productImagePreview,
        productDescription: productDescription,
        productCategory: classificationResult.productType,
      });
      setArSuggestion(result);
      setCurrentStep("done");
      toast({ title: "AR Suggestion Generated!", description: "Check out the AR demo idea below." });
    } catch (err) {
      console.error("AR Suggestion error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during AR suggestion.";
      setError(errorMessage);
      toast({ title: "AR Suggestion Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const progressValue = () => {
    if (currentStep === "upload") return 25;
    if (currentStep === "classify" && !classificationResult && !error) return 50;
    if (classificationResult && currentStep !== "suggest" && currentStep !== "done") return 50;
    if (currentStep === "suggest" && !arSuggestion && !error) return 75;
    if (arSuggestion || currentStep === "done") return 100;
    return 0;
  };

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UploadCloud className="text-primary" /> Upload Product</CardTitle>
          <CardDescription>
            Provide an image and description of your product to start the AR showcase process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="product-image" className="mb-2 block font-medium">Product Image</Label>
            <Input id="product-image" type="file" accept="image/*" onChange={handleImageChange} className="file:text-primary file:font-semibold" />
          </div>

          {productImagePreview && (
            <div className="mt-4 border rounded-md p-4 bg-muted/50">
              <Label className="block mb-2 font-medium">Image Preview:</Label>
              <Image src={productImagePreview} alt="Product Preview" width={200} height={200} className="rounded-md object-contain max-h-[200px] shadow-md" data-ai-hint="product image" />
            </div>
          )}

          <div>
            <Label htmlFor="product-description" className="mb-2 block font-medium">Product Description</Label>
            <Textarea
              id="product-description"
              placeholder="e.g., Handcrafted ceramic vase, blue glaze, 10 inches tall."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleClassify} disabled={isLoading || !productImage || !productDescription} className="w-full sm:w-auto">
              {isLoading && currentStep === "classify" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageSearch className="mr-2 h-4 w-4" />}
              Classify Product
            </Button>
            <Button onClick={handleSuggestDemo} disabled={isLoading || !classificationResult} className="w-full sm:w-auto">
              {isLoading && currentStep === "suggest" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Suggest AR Demo
            </Button>
        </CardFooter>
      </Card>

      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" /> AI Analysis & Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
                <Label>Process Progress:</Label>
                <Progress value={progressValue()} className="w-full h-3" />
                <p className="text-xs text-muted-foreground capitalize">{currentStep === "idle" ? "Awaiting upload" : currentStep.replace("-", " ")}</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {classificationResult && (
              <Alert variant="default" className="bg-accent/20 border-accent">
                <Wand2 className="h-4 w-4 text-accent" />
                <AlertTitle className="text-accent-foreground">Product Classified!</AlertTitle>
                <AlertDescription>
                  <p><strong>Type:</strong> {classificationResult.productType}</p>
                  <p><strong>Confidence:</strong> {(classificationResult.confidence * 100).toFixed(0)}%</p>
                </AlertDescription>
              </Alert>
            )}

            {arSuggestion && (
              <Alert variant="default" className="bg-primary/10 border-primary">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary-foreground">AR Demo Suggestion:</AlertTitle>
                <AlertDescription className="text-primary-foreground/90">
                  {arSuggestion.arDemoSuggestion}
                </AlertDescription>
              </Alert>
            )}
            
            {currentStep === "done" && arSuggestion && (
                <div className="border-2 border-dashed border-primary rounded-lg p-6 text-center bg-primary/5">
                    <h3 className="text-lg font-semibold text-primary mb-2">AR View Placeholder</h3>
                    <p className="text-sm text-muted-foreground">
                        This is where the WebXR AR demonstration for "{classificationResult?.productType}" would be displayed.
                    </p>
                    <Button variant="outline" className="mt-4">
                        Launch AR Demo (Not Implemented)
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
