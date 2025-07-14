"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, BookOpen, AlertCircle } from "lucide-react";
import { VerseSuggestions } from "@/components/verse-suggestions";
import { ExampleLessons } from "@/components/example-lessons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

export default function Home() {
    const [lesson, setLesson] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<{
        lesson: string;
        verses: { reference: string; text: string; explanation: string }[];
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lesson.trim()) return;

        setIsLoading(true);
        setResults(null);
        setError(null);

        try {
            // Use fetch with text() first to avoid JSON parsing errors
            const response = await fetch("/api/find-verses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lesson }),
            });

            // First get the raw text
            const rawText = await response.text();

            // Then try to parse it as JSON
            let data;
            try {
                data = JSON.parse(rawText);
            } catch (err) {
                console.error(
                    "JSON parse error:",
                    err,
                    "Raw response:",
                    rawText
                );
                throw new Error(
                    "Failed to parse response from server. Please try again."
                );
            }

            // Check if the response contains an error field
            if (data.error) {
                setError(
                    data.error + (data.details ? `: ${data.details}` : "")
                );
                console.error("API error:", data.error, data.details);

                // If we have fallback verses despite the error, show them
                if (data.verses && data.verses.length > 0) {
                    setResults({
                        lesson: data.lesson || lesson,
                        verses: data.verses,
                    });
                }
            }
            // Check if we have verses to display
            else if (data.verses && data.verses.length > 0) {
                setResults(data);
            }
            // No verses found
            else {
                setError(
                    "No Bible verses were found for this topic. Please try a different topic."
                );
            }
        } catch (error) {
            console.error("Error:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleSelect = (exampleContent: string) => {
        setLesson(exampleContent);
        setError(null);
    };

    return (
        <main className="container mx-auto py-8 px-4">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Image width={50} height={50} src="/icon.png" alt="" />
                        Bible Verse Finder
                    </CardTitle>
                    <CardDescription>
                        Enter a topic or theme, and discover Bible verses for
                        educational study.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            placeholder="Enter a topic or theme here (e.g., love, wisdom, faith)..."
                            className="min-h-[150px]"
                            value={lesson}
                            onChange={(e) => setLesson(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            For educational purposes only. This tool helps find
                            Bible verses related to your topic for study and
                            learning.
                        </p>
                        <ExampleLessons onSelectExample={handleExampleSelect} />
                        <Button
                            type="submit"
                            disabled={isLoading || !lesson.trim()}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Finding Bible verses...
                                </>
                            ) : (
                                "Find Bible Verses"
                            )}
                        </Button>
                    </form>

                    {error && (
                        <Alert
                            variant={results ? "default" : "destructive"}
                            className="mt-4"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>
                                {results ? "Note" : "Error"}
                            </AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {results && <VerseSuggestions results={results} />}
                </CardContent>
            </Card>
        </main>
    );
}
