"use client";

import { Button } from "@/components/ui/button";

type ExampleLesson = {
    title: string;
    content: string;
};

const examples: ExampleLesson[] = [
    {
        title: "Love",
        content: "The concept of love in biblical teachings",
    },
    {
        title: "Wisdom",
        content: "Biblical perspectives on wisdom and knowledge",
    },
    {
        title: "Faith",
        content: "The nature and importance of faith",
    },
    {
        title: "Forgiveness",
        content: "Teachings about forgiveness and reconciliation",
    },
    {
        title: "Hope",
        content: "Biblical understanding of hope and perseverance",
    },
];

interface ExampleLessonsProps {
    onSelectExample: (content: string) => void;
}

export function ExampleLessons({ onSelectExample }: ExampleLessonsProps) {
    return (
        <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Example topics:</h3>
            <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectExample(example.content)}
                    >
                        {example.title}
                    </Button>
                ))}
            </div>
        </div>
    );
}
