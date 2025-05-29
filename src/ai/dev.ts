
import { config } from 'dotenv';
config();

import '@/ai/flows/classify-product-type.ts';
import '@/ai/flows/generate-ar-demo-suggestion.ts';
import '@/ai/flows/assess-skill-level-flow.ts'; // Re-added
import '@/ai/flows/generate-skill-quiz-flow.ts'; // Added new flow for quiz generation
