import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Verse = {
    reference: string;
    text: string;
    explanation: string;
};

type ResultsProps = {
    results: {
        lesson: string;
        verses: Verse[];
    };
};

export function VerseSuggestions({ results }: ResultsProps) {
    return (
        <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">
                Bible Verses related to -{" "}
            </h2>
            <p className="text-muted-foreground italic">
                Topic: "{results.lesson}"
            </p>

            <div className="space-y-4">
                {results.verses.map((verse, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col space-y-2">
                                <h3 className="font-bold text-lg">
                                    {verse.reference}
                                </h3>
                                <p className="text-muted-foreground italic">
                                    "{verse.text}"
                                </p>
                                <Separator className="my-2" />
                                <p>{verse.explanation}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
                These verses are provided for educational purposes only. For a
                deeper understanding, consider consulting scholarly resources
                and different translations.
            </p>
        </div>
    );
}
