"use client";

import { useState } from "react";
import { summarizeSessionNotes } from "@/ai/flows/summarize-session-notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { updatePatientNotes } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface NoteSummarizerProps {
  patientId: string;
  initialNotes: string;
}

export function NoteSummarizer({ patientId, initialNotes }: NoteSummarizerProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    try {
      const result = await summarizeSessionNotes({ sessionNotes: notes });
      setSummary(result.summary);
    } catch (e) {
      setError("Failed to generate summary. Please try again.");
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await updatePatientNotes(patientId, notes);
      toast({
        title: "Success",
        description: "Patient notes have been saved.",
      });
    } catch (e) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notes. Please try again.",
      });
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Therapist Notes</CardTitle>
                <CardDescription>Record and manage session details here.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleSaveNotes} disabled={isSaving || !notes}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Notes"}
                </Button>
                <Button onClick={handleSummarize} disabled={isSummarizing || !notes}>
                <Wand2 className="mr-2 h-4 w-4" />
                {isSummarizing ? "Summarizing..." : "Summarize with AI"}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start typing session notes..."
            className="min-h-[200px] text-base"
          />
        </CardContent>
      </Card>
      {isSummarizing && (
        <Card>
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
