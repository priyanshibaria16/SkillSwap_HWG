'use server';
/**
 * @fileOverview An AI agent that classifies the type of a product based on an image.
 *
 * - classifyProductType - A function that classifies the product type.
 * - ClassifyProductTypeInput - The input type for the classifyProductType function.
 * - ClassifyProductTypeOutput - The return type for the classifyProductType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyProductTypeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the product.'),
});
export type ClassifyProductTypeInput = z.infer<typeof ClassifyProductTypeInputSchema>;

const ClassifyProductTypeOutputSchema = z.object({
  productType: z.string().describe('The classified type of the product.'),
  confidence: z.number().describe('The confidence level of the classification (0-1).'),
});
export type ClassifyProductTypeOutput = z.infer<typeof ClassifyProductTypeOutputSchema>;

export async function classifyProductType(input: ClassifyProductTypeInput): Promise<ClassifyProductTypeOutput> {
  return classifyProductTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyProductTypePrompt',
  input: {schema: ClassifyProductTypeInputSchema},
  output: {schema: ClassifyProductTypeOutputSchema},
  prompt: `You are an AI expert in product classification.

You will classify the type of product based on the provided image and description.
You will also provide a confidence level for your classification.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Respond with the product type and the confidence level. Confidence level must be between 0 and 1.
`,
});

const classifyProductTypeFlow = ai.defineFlow(
  {
    name: 'classifyProductTypeFlow',
    inputSchema: ClassifyProductTypeInputSchema,
    outputSchema: ClassifyProductTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
