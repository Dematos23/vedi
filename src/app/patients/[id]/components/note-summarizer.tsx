
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updatePatientNotes } from "@/lib/actions";

interface NoteSummarizerProps {
  patientId: string;
  initialNotes: string;
  summary: string | null;
  isSummarizing: boolean;
  error: string | null;
  onNotesChange: (newNotes: string) => void;
}

export function NoteSummarizer({
  patientId,
  initialNotes,
  summary,
  isSummarizing,
  error,
  onNotesChange,
}: NoteSummarizerProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [notes, setNotes] = React.useState(initialNotes || "");
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await updatePatientNotes(patientId, notes);
      toast({
        title: "Success",
        description: "Patient notes have been saved.",
      });
      setIsEditing(false);
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

  const handleLocalNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onNotesChange(newNotes);
  }

  React.useEffect(() => {
    if (!isEditing) {
      setNotes(initialNotes);
    }
  }, [initialNotes, isEditing]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Therapist Notes</CardTitle>
            <CardDescription>Record and manage session details here.</CardDescription>
          </div>
          {!isEditing && (
             <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Notes</span>
             </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
             <Textarea
                value={notes}
                onChange={handleLocalNotesChange}
                placeholder="Start typing session notes..."
                className="min-h-[200px] text-base"
             />
          ) : (
             <p className="text-sm text-muted-foreground min-h-[200px]">
                {notes || "No notes have been added for this session yet."}
             </p>
          )}
        </CardContent>
        {isEditing && (
            <CardFooter className="justify-end gap-2">
                 <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSaveNotes} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </CardFooter>
        )}
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
