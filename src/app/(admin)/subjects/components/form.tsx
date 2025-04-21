import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { subjectReqDto, SubjectReqDto } from "@/types/subject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CardFooter } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormProps {
    onSubmit: (data: SubjectReqDto) => void;
    isPending: boolean;
    initialValues?: SubjectReqDto;
}

export function SubjectForm(props: FormProps) {
    const form = useForm<SubjectReqDto>({
        resolver: zodResolver(subjectReqDto),
        defaultValues: {
            name: props.initialValues?.name || "",
        },
        mode: "onBlur",
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium">Subject Name</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Mathematics, Science, History"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <CardFooter className="flex justify-end px-0 pb-0">
                        <Button
                            type="submit"
                            disabled={props.isPending}
                            className="min-w-[120px]"
                        >
                            {props.isPending ? "Saving..." : "Save Subject"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>

            {/* Right Column - Information Panel */}
            <div className="lg:col-span-1 space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                    <AlertTitle className="text-blue-800 flex items-center gap-2">
                        <InfoIcon className="h-4 w-4" />
                        About Subjects
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 mt-2 space-y-2">
                        <p>Subjects are the main categories for organizing your content.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Example: <strong>Mathematics</strong></li>
                            <li>Example: <strong>Science</strong></li>
                            <li>Example: <strong>Language Arts</strong></li>
                        </ul>
                    </AlertDescription>
                </Alert>

                <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Naming Guidelines</h3>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Use broad, general categories</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Keep names singular (e.g., "Math" not "Maths")</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Capitalize proper names</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Avoid abbreviations when possible</span>
                        </li>
                    </ul>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Preview</h3>
                    <div className="text-sm">
                        {form.watch("name") ? (
                            <p className="font-medium">{form.watch("name")}</p>
                        ) : (
                            <p className="text-muted-foreground italic">Subject name will appear here</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}