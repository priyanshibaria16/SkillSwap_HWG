
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Lightbulb, BrainCircuit, Sparkles, CheckCircle, ArrowLeft } from "lucide-react";
import { assessSkillLevel, type AssessSkillLevelOutput } from "@/ai/flows/assess-skill-level-flow";
import { generateSkillQuiz, type QuizQuestion } from "@/ai/flows/generate-skill-quiz-flow";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

// This data MUST be consistent with src/app/(app)/search/page.tsx for IDs
// AND must include the 'description' field used by this component.
const allSkillsData = [
  { id: "1", name: "Advanced Pottery Techniques", tutor: "Alice Wonderland", rating: 4.8, price: "₹150/session", image: "https://img.freepik.com/free-photo/creating-jugs_1098-13058.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Crafts", description: "Master advanced pottery skills including complex forms, glazing, and firing techniques.", dataAiHint: "pottery craft" },
  { id: "2", name: "Conversational Spanish", tutor: "Bob The Builder", rating: 4.5, price: "Barter", image: "https://img.freepik.com/free-vector/learning-spanish-concept-illustration_114360-19554.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Language", description: "Improve your Spanish speaking and listening skills for everyday conversations.", dataAiHint: "language learning" },
  { id: "3", name: "Introduction to Web Development", tutor: "Charlie Brown", rating: 4.9, price: "₹200/session", image: "https://img.freepik.com/free-vector/web-development-concept-website-optimization-web-page-interface-design-coding-testing-site-internet-modern-technology-idea-isolated-flat-vector-illustration_613284-2939.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Tech", description: "Learn the fundamentals of HTML, CSS, and JavaScript to build your first websites.", dataAiHint: "coding programming" },
  { id: "4", name: "Yoga for Beginners", tutor: "Diana Prince", rating: 4.7, price: "₹100/session", image: "https://img.freepik.com/free-photo/portrait-young-woman-stretching-home-mat_23-2148896443.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Wellness", description: "A gentle introduction to yoga, focusing on basic poses, breathing, and relaxation.", dataAiHint: "yoga fitness" },
  { id: "5", name: "Digital Marketing Fundamentals", tutor: "Edward Scissorhands", rating: 4.6, price: "₹120/session", image: "https://img.freepik.com/free-photo/man-suit-standing-office-with-clipboard-pointing-poster-with-words_1098-17121.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Tech", description: "Understand the basics of digital marketing, including SEO, content marketing, and social media.", dataAiHint: "marketing computer" },
  { id: "6", name: "Gourmet Baking Masterclass", tutor: "Fiona Gallagher", rating: 4.9, price: "Barter", image: "https://img.freepik.com/free-photo/medium-shot-woman-preparing-dessert_23-2148972040.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Crafts", description: "Learn to bake delicious gourmet pastries, breads, and cakes with expert techniques.", dataAiHint: "baking cake" },
];

type SkillDataType = typeof allSkillsData[0];

export function SkillAssessmentClient({ skillId }: { skillId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [skill, setSkill] = useState<SkillDataType | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessSkillLevelOutput | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  
  const [aiGeneratedQuiz, setAiGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isLoadingSkill, setIsLoadingSkill] = useState(true);


  useEffect(() => {
    setIsLoadingSkill(true);
    console.log("[SkillAssessmentClient] Received skillId prop:", skillId);
    console.log("[SkillAssessmentClient] Available skill IDs in allSkillsData:", allSkillsData.map(s => s.id));

    if (skillId) {
      const foundSkill = allSkillsData.find(s => s.id === skillId);
      console.log("[SkillAssessmentClient] Found skill:", foundSkill);
      setSkill(foundSkill || null);
    } else {
      setSkill(null); 
      console.log("[SkillAssessmentClient] No skillId prop received or skillId is undefined/null.");
    }
    setIsLoadingSkill(false);
    // Reset state if skillId changes
    setShowQuiz(false);
    setQuizAnswers({});
    setAssessmentResult(null);
    setIsAssessing(false);
    setAiGeneratedQuiz(null);
    setIsGeneratingQuiz(false);
    setQuizError(null);
  }, [skillId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleStartAssessment = async () => {
    if (!skill) return;
    setShowQuiz(true);
    setAssessmentResult(null); 
    setQuizAnswers({}); 
    setQuizError(null);
    setAiGeneratedQuiz(null); 

    setIsGeneratingQuiz(true);
    try {
        const quizData = await generateSkillQuiz({ skillName: skill.name, numQuestions: 3 });
        if (quizData.quizQuestions && quizData.quizQuestions.length > 0) {
            setAiGeneratedQuiz(quizData.quizQuestions);
        } else {
            setQuizError("AI could not generate quiz questions. Please try again or contact support.");
            toast({ title: "Quiz Generation Failed", description: "Could not generate quiz questions.", variant: "destructive"});
        }
    } catch (error: any) {
        console.error("Quiz generation error:", error);
        const errorMessage = error.message || "An error occurred while generating the quiz.";
        setQuizError(errorMessage);
        toast({ title: "Quiz Generation Error", description: errorMessage, variant: "destructive" });
    } finally {
        setIsGeneratingQuiz(false);
    }
  };

  const handleSubmitQuiz = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!skill || !aiGeneratedQuiz) return;

    if (Object.keys(quizAnswers).length !== aiGeneratedQuiz.length) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsAssessing(true);
    setAssessmentResult(null);
    setQuizError(null);

    const questionsAndAnswers = aiGeneratedQuiz.map(q => {
      const selectedOption = q.options.find(opt => opt.value === quizAnswers[q.id]);
      return {
        questionText: q.text,
        userAnswerText: selectedOption?.label || "No answer provided",
      };
    });

    try {
      const result = await assessSkillLevel({
        skillName: skill.name,
        questionsAndAnswers: questionsAndAnswers,
      });
      setAssessmentResult(result);
      toast({
        title: "Assessment Complete!",
        description: `Your AI-assessed level: ${result.level}`,
      });
    } catch (error: any) {
      console.error("Assessment error:", error);
      setQuizError(error.message || "An error occurred while assessing your skill level.");
      toast({
        title: "Assessment Failed",
        description: error.message || "An error occurred while assessing your skill level.",
        variant: "destructive",
      });
    } finally {
      setIsAssessing(false);
    }
  };

  if (isLoadingSkill) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading skill information...</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div>
        <PageHeader title="Skill Not Found" description="The skill you are looking for could not be found, or the ID is incorrect." />
         <Button asChild className="mt-4">
            <Link href="/search"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Search</Link>
          </Button>
      </div>
    );
  }

  const currentQuizToDisplay = aiGeneratedQuiz;

  return (
    <div>
      <PageHeader title={skill.name} description={`Learn from ${skill.tutor}. Category: ${skill.category}`} />
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="p-0">
              <Image src={skill.image} alt={skill.name} width={800} height={450} className="rounded-t-lg object-cover w-full h-64 md:h-80" data-ai-hint={skill.dataAiHint || 'skill training'} />
            </CardHeader>
            <CardContent className="pt-6">
              <CardTitle className="mb-2">About this Skill</CardTitle>
              <CardDescription className="text-base leading-relaxed">{skill.description}</CardDescription>
              <p className="mt-4 font-semibold text-lg text-primary">{skill.price}</p>
              <div className="mt-6">
                <Button size="lg" className="w-full sm:w-auto">Book Session with {skill.tutor} (Not Implemented)</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/>AI Skill Assessment</CardTitle>
              <CardDescription>Let AI generate a quick quiz to help understand your current level.</CardDescription>
            </CardHeader>
            <CardContent>
              {!showQuiz && !assessmentResult && (
                <Button onClick={handleStartAssessment} className="w-full" disabled={isGeneratingQuiz}>
                  {isGeneratingQuiz ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Start AI Assessment
                </Button>
              )}

              {quizError && (
                <Alert variant="destructive" className="my-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{quizError}</AlertDescription>
                </Alert>
              )}

              {showQuiz && !assessmentResult && (
                <>
                  {isGeneratingQuiz && (
                    <div className="flex flex-col items-center justify-center p-6 space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">AI is generating your quiz...</p>
                    </div>
                  )}
                  {!isGeneratingQuiz && currentQuizToDisplay && currentQuizToDisplay.length > 0 && (
                    <form onSubmit={handleSubmitQuiz} className="space-y-6">
                      {currentQuizToDisplay.map((q, index) => (
                        <div key={q.id}>
                          <Label className="font-medium text-base">Question {index + 1}: {q.text}</Label>
                          <RadioGroup
                            onValueChange={(value) => handleAnswerChange(q.id, value)}
                            value={quizAnswers[q.id]}
                            className="mt-2 space-y-1"
                          >
                            {q.options.map(opt => (
                              <div key={opt.value} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                                <RadioGroupItem value={opt.value} id={`${q.id}-${opt.value}`} />
                                <Label htmlFor={`${q.id}-${opt.value}`} className="font-normal cursor-pointer flex-1">{opt.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                      <Button type="submit" className="w-full" disabled={isAssessing}>
                        {isAssessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Submit Answers & Get Assessment
                      </Button>
                    </form>
                  )}
                  {!isGeneratingQuiz && (!currentQuizToDisplay || currentQuizToDisplay.length === 0) && !quizError && (
                     <Alert>
                        <AlertTitle>Quiz Not Ready</AlertTitle>
                        <AlertDescription>Could not load quiz questions. Try starting the assessment again.</AlertDescription>
                     </Alert>
                  )}
                </>
              )}

              {assessmentResult && (
                <Alert variant="default" className="bg-accent/20 border-accent">
                  <Wand2 className="h-5 w-5 text-accent" />
                  <AlertTitle className="text-lg font-semibold text-accent-foreground">AI Assessment Result</AlertTitle>
                  <AlertDescription className="mt-2 space-y-2">
                    <p><strong>Your Assessed Level:</strong> <span className="font-bold">{assessmentResult.level}</span></p>
                    <p><strong>Justification:</strong> {assessmentResult.justification}</p>
                    <div className="mt-4 pt-3 border-t">
                      <p className="text-sm text-muted-foreground flex items-center gap-1"><Lightbulb className="h-4 w-4"/>Next Steps:</p>
                      <p className="text-sm">We recommend looking for tutors and sessions suitable for {assessmentResult.level} learners. (Recommendation logic not yet implemented).</p>
                       <Button onClick={handleStartAssessment} variant="outline" size="sm" className="mt-3 mr-2" disabled={isGeneratingQuiz}>
                        {isGeneratingQuiz ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Retake with New Quiz
                      </Button>
                       <Button onClick={() => { setShowQuiz(false); setAssessmentResult(null); setAiGeneratedQuiz(null); }} variant="ghost" size="sm" className="mt-3">
                        Close Assessment
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
