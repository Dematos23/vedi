'use server';
/**
 * @fileOverview AI-powered session note summarization flow.
 *
 * - summarizeSessionNotes - A function that summarizes session notes into a concise markdown format.
 * - SummarizeSessionNotesInput - The input type for the summarizeSessionNotes function.
 * - SummarizeSessionNotesOutput - The return type for the summarizeSessionNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSessionNotesInputSchema = z.object({
  sessionNotes: z
    .string()
    .describe('The session notes to be summarized, in free text format.'),
});
export type SummarizeSessionNotesInput = z.infer<typeof SummarizeSessionNotesInputSchema>;

const SummarizeSessionNotesOutputSchema = z.object({
  summary: z
    .string()
    .describe('The summarized session notes in markdown format.'),
});
export type SummarizeSessionNotesOutput = z.infer<typeof SummarizeSessionNotesOutputSchema>;

export async function summarizeSessionNotes(input: SummarizeSessionNotesInput): Promise<SummarizeSessionNotesOutput> {
  return summarizeSessionNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSessionNotesPrompt',
  input: {schema: SummarizeSessionNotesInputSchema},
  output: {schema: SummarizeSessionNotesOutputSchema},
  prompt: `You are an expert therapist, and you are helping summarize session notes.

  Summarize the following session notes into a concise markdown summary, highlighting key points and patient progress.

  Session Notes:
  {{sessionNotes}}`,
});

const summarizeSessionNotesFlow = ai.defineFlow(
  {
    name: 'summarizeSessionNotesFlow',
    inputSchema: SummarizeSessionNotesInputSchema,
    outputSchema: SummarizeSessionNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
