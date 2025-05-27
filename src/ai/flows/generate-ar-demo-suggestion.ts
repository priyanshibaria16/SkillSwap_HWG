'use server';

/**
 * @fileOverview Generates AR demo suggestions based on a product photo and description.
 *
 * - generateArDemoSuggestion - A function that generates AR demo suggestions.
 * - GenerateArDemoSuggestionInput - The input type for the generateArDemoSuggestion function.
 * - GenerateArDemoSuggestionOutput - The return type for the generateArDemoSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArDemoSuggestionInputSchema = z.object({
  productPhotoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  productDescription: z.string().describe('A short description of the product.'),
  productCategory: z.string().describe('The category of the product (e.g., shirt, pottery).'),
});
export type GenerateArDemoSuggestionInput = z.infer<typeof GenerateArDemoSuggestionInputSchema>;

const GenerateArDemoSuggestionOutputSchema = z.object({
  arDemoSuggestion: z.string().describe('A suggestion for an AR demo scenario for the product.'),
});
export type GenerateArDemoSuggestionOutput = z.infer<typeof GenerateArDemoSuggestionOutputSchema>;

export async function generateArDemoSuggestion(input: GenerateArDemoSuggestionInput): Promise<GenerateArDemoSuggestionOutput> {
  return generateArDemoSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArDemoSuggestionPrompt',
  input: {schema: GenerateArDemoSuggestionInputSchema},
  output: {schema: GenerateArDemoSuggestionOutputSchema},
  prompt: `You are an expert in creating AR demos for online products. A tutor has uploaded a product with a photo, description and category. You will suggest a suitable AR demo scenario for the product.

Product Category: {{{productCategory}}}
Product Description: {{{productDescription}}}
Product Photo: {{media url=productPhotoDataUri}}

Based on the information above, suggest an AR demo scenario that would best showcase the product to potential learners. Be creative and think of ways to make the demo interactive and engaging. For example, if the product is a shirt, suggest displaying it on a 3D avatar's torso. If the product is pottery, suggest allowing the user to virtually paint the pottery.

AR Demo Suggestion: `,
});

const generateArDemoSuggestionFlow = ai.defineFlow(
  {
    name: 'generateArDemoSuggestionFlow',
    inputSchema: GenerateArDemoSuggestionInputSchema,
    outputSchema: GenerateArDemoSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
