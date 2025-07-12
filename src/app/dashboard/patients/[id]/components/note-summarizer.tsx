
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface NoteSummarizerProps {
  notes: string;
  setNotes: (notes: string) => void;
  summary: string | null;
  isSummarizing: boolean;
  error: string | null;
}

export function NoteSummarizer({
  notes,
  setNotes,
  summary,
  isSummarizing,
  error,
}: NoteSummarizerProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Therapist Notes</CardTitle>
          <CardDescription>Record and manage session details here.</CardDescription>
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
