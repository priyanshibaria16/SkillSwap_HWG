
'use server';
/**
 * @fileOverview An AI agent that assesses a learner's skill level based on quiz answers.
 *
 * - assessSkillLevel - A function that assesses the skill level.
 * - AssessSkillLevelInput - The input type for the assessSkillLevel function.
 * - AssessSkillLevelOutput - The return type for the assessSkillLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionAnswerPairSchema = z.object({
  questionText: z.string().describe("The text of the question that was asked to the user."),
  userAnswerText: z.string().describe("The text of the answer provided by the user for that question."),
});

const AssessSkillLevelInputSchema = z.object({
  skillName: z.string().describe("The name of the skill being assessed (e.g., 'Pottery', 'Conversational Spanish')."),
  questionsAndAnswers: z.array(QuestionAnswerPairSchema).describe("An array of questions that were asked and the user's corresponding answers."),
});
export type AssessSkillLevelInput = z.infer<typeof AssessSkillLevelInputSchema>;

const AssessSkillLevelOutputSchema = z.object({
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).describe("The assessed proficiency level of the learner for the given skill."),
  justification: z.string().describe("A brief explanation or justification for the assessed skill level based on the answers provided."),
});
export type AssessSkillLevelOutput = z.infer<typeof AssessSkillLevelOutputSchema>;

export async function assessSkillLevel(input: AssessSkillLevelInput): Promise<AssessSkillLevelOutput> {
  return assessSkillLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessSkillLevelPrompt',
  input: {schema: AssessSkillLevelInputSchema},
  output: {schema: AssessSkillLevelOutputSchema},
  prompt: `You are an expert skill assessor. Your task is to evaluate a user's proficiency level in a specific skill based on their answers to a short quiz.

Skill being assessed: {{{skillName}}}

The user was asked the following questions and provided these answers:
{{#each questionsAndAnswers}}
Question: "{{this.questionText}}"
User's Answer: "{{this.userAnswerText}}"
{{/each}}

Based on these questions and answers, determine if the user's proficiency level for "{{skillName}}" is Beginner, Intermediate, or Advanced.
Provide a brief justification for your assessment.

Consider the following general guidelines for levels:
- Beginner: Little to no prior experience or knowledge. Answers may be incorrect or show very basic understanding.
- Intermediate: Some foundational knowledge and practical experience. Can perform basic tasks but may struggle with complex scenarios or require guidance. Answers show partial understanding or can describe basic concepts.
- Advanced: Significant knowledge, practical experience, and can handle complex tasks independently. Can teach others or troubleshoot complex issues. Answers are mostly correct, detailed, and show deep understanding.

Output your assessment in the specified JSON format with "level" and "justification".
`,
});

const assessSkillLevelFlow = ai.defineFlow(
  {
    name: 'assessSkillLevelFlow',
    inputSchema: AssessSkillLevelInputSchema,
    outputSchema: AssessSkillLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return an output for skill assessment.");
    }
    return output;
  }
);
