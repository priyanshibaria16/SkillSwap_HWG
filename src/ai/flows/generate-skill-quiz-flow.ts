
'use server';
/**
 * @fileOverview An AI agent that generates a short quiz for a given skill.
 *
 * - generateSkillQuiz - A function that generates quiz questions.
 * - GenerateSkillQuizInput - The input type for the generateSkillQuiz function.
 * - GenerateSkillQuizOutput - The return type for the generateSkillQuiz function.
 * - QuizQuestion - The type for a single quiz question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSkillQuizInputSchema = z.object({
  skillName: z.string().describe("The name of the skill for which to generate a quiz (e.g., 'Advanced Pottery', 'Conversational Spanish')."),
  numQuestions: z.number().min(2).max(5).default(3).describe("The number of quiz questions to generate (between 2 and 5).")
});
export type GenerateSkillQuizInput = z.infer<typeof GenerateSkillQuizInputSchema>;

const QuizQuestionOptionSchema = z.object({
  value: z.string().describe("A short, unique value for the option, e.g., 'a', 'b', 'c', 'd'."),
  label: z.string().describe("The display text for this multiple-choice option."),
});

const QuizQuestionSchema = z.object({
  id: z.string().describe("A unique identifier for the question, e.g., 'q1', 'q2'."),
  text: z.string().describe("The text of the quiz question."),
  options: z.array(QuizQuestionOptionSchema).min(3).max(4).describe("An array of 3 to 4 multiple-choice options for the question."),
  // Optional: Could ask AI for the correct answer if needed for other features, but not strictly for assessment by another AI.
  // correctAnswerValue: z.string().optional().describe("The 'value' of the correct option."),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const GenerateSkillQuizOutputSchema = z.object({
  quizQuestions: z.array(QuizQuestionSchema).describe("An array of generated quiz questions."),
});
export type GenerateSkillQuizOutput = z.infer<typeof GenerateSkillQuizOutputSchema>;

export async function generateSkillQuiz(input: GenerateSkillQuizInput): Promise<GenerateSkillQuizOutput> {
  return generateSkillQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSkillQuizPrompt',
  input: {schema: GenerateSkillQuizInputSchema},
  output: {schema: GenerateSkillQuizOutputSchema},
  prompt: `You are an expert curriculum designer and quiz creator.
Your task is to generate a short multiple-choice quiz to help assess a user's proficiency in a specific skill.

Skill to generate a quiz for: {{{skillName}}}
Number of questions to generate: {{{numQuestions}}}

For each question:
- Generate a clear and concise question text relevant to the specified skill.
- Create 3 to 4 multiple-choice options.
- One option should be the correct answer, and the others should be plausible distractors.
- Ensure each option has a unique 'value' (e.g., "a", "b", "c") and a descriptive 'label'.
- Provide a unique 'id' for each question (e.g., "q1", "q2").

Vary the difficulty of the questions if possible, covering basic to slightly more advanced concepts appropriate for a quick assessment.

Return the output in the specified JSON format with an array of "quizQuestions".
Example question structure:
{
  "id": "q1",
  "text": "What is the primary purpose of 'wedging' clay in pottery?",
  "options": [
    { "value": "a", "label": "To add color to the clay." },
    { "value": "b", "label": "To remove air bubbles and ensure consistent moisture." },
    { "value": "c", "label": "To make the clay harder before firing." }
  ]
}
`,
});

const generateSkillQuizFlow = ai.defineFlow(
  {
    name: 'generateSkillQuizFlow',
    inputSchema: GenerateSkillQuizInputSchema,
    outputSchema: GenerateSkillQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.quizQuestions || output.quizQuestions.length === 0) {
        // Fallback if AI fails to generate questions in the correct format
        throw new Error("The AI model did not return valid quiz questions. Please try again.");
    }
    // Ensure unique IDs for questions if AI doesn't provide them reliably
    const questionsWithGuaranteedIds = output.quizQuestions.map((q, index) => ({
        ...q,
        id: q.id || `q${index + 1}`,
    }));
    return { quizQuestions: questionsWithGuaranteedIds };
  }
);
