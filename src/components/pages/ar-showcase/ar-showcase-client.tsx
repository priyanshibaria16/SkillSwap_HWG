
"use client";

import { useState, type ChangeEvent, useEffect, useRef } from "react";
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null); // null: initial, true: granted, false: denied

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
      setHasCameraPermission(null); // Reset camera permission status on new image
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

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia not supported on this browser.');
        // setError('Your browser does not support camera access, which is needed for AR.'); // This might conflict with main error state
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Browser Not Supported',
          description: 'Camera access (getUserMedia) is not supported on this browser.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // toast({ // This toast might be too frequent if user revisits
        //   title: 'Camera Access Enabled',
        //   description: 'AR preview can now use your camera.',
        // });
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings for the AR preview.',
        });
      }
    };

    if (currentStep === 'done' && arSuggestion && hasCameraPermission === null) {
      getCameraPermission();
    }

    // Cleanup function to stop the camera stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null; // Clear srcObject
      }
    };
  }, [currentStep, arSuggestion, toast, hasCameraPermission]); // Re-run if hasCameraPermission is reset to null

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

            {arSuggestion && !classificationResult && ( // Should not happen if logic is correct, but as a fallback
               <Alert variant="default" className="bg-primary/10 border-primary">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary-foreground">AR Demo Suggestion Ready</AlertTitle>
                <AlertDescription className="text-primary-foreground/90">
                  {arSuggestion.arDemoSuggestion}
                </AlertDescription>
              </Alert>
            )}
            
            {currentStep === "done" && arSuggestion && (
              <div className="border-2 border-dashed border-primary rounded-lg p-4 md:p-6 text-center bg-primary/5 space-y-4">
                <h3 className="text-lg font-semibold text-primary">AR Product Preview</h3>
                 {arSuggestion.arDemoSuggestion && classificationResult && (
                    <Alert variant="default" className="bg-primary/10 border-primary text-left mb-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Suggested AR Demo:</AlertTitle>
                        <AlertDescription className="text-primary/90">
                        {arSuggestion.arDemoSuggestion} for a "{classificationResult.productType}".
                        </AlertDescription>
                    </Alert>
                 )}
                <p className="text-sm text-muted-foreground">
                  Attempting to access your camera for a basic preview.
                </p>
                
                <div className="w-full max-w-md mx-auto bg-black rounded-md overflow-hidden shadow-inner aspect-video flex items-center justify-center">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                </div>
            
                {hasCameraPermission === null && !error && !(isLoading && currentStep === 'suggest') && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertTitle>Accessing Camera...</AlertTitle>
                    <AlertDescription>
                      Please grant permission when prompted by your browser.
                    </AlertDescription>
                  </Alert>
                )}
            
                {hasCameraPermission === false && (
                  <Alert variant="destructive" className="text-left">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied or Unavailable</AlertTitle>
                    <AlertDescription>
                      Please ensure camera permissions are enabled in your browser settings and that your browser supports camera access. The AR preview cannot function without it.
                    </AlertDescription>
                  </Alert>
                )}
                 {hasCameraPermission === true && (
                    <Alert variant="default" className="bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-700 text-left text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>Camera Access Active!</AlertTitle>
                        <AlertDescription>
                            Your camera feed is live. The next step for a full AR experience would be to overlay the 3D model of the product.
                        </AlertDescription>
                    </Alert>
                )}
                
                <Button variant="outline" className="mt-4" disabled>
                  Launch Full AR Demo (Not Implemented)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

