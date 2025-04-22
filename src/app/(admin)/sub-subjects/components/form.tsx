import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Subject } from "@/types/subject";
import { subSubjectReqDto, SubSubjectReqDto } from "@/types/sub-subject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormProps {
    onSubmit: (data: SubSubjectReqDto) => void;
    isPending: boolean;
    subjects: Subject[];
    form: UseFormReturn<SubSubjectReqDto>;
}

export function SubSubjectForm({onSubmit, isPending, subjects, form}: FormProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="subjectId"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium">Subject</FormLabel>
                                </div>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select parent subject" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium">Sub-Subject Name</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Algebra, Organic Chemistry"
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
                            disabled={isPending}
                            className="min-w-[120px]"
                        >
                            {isPending ? "Saving..." : "Save Sub-Subject"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>

            {/* Right Column - Information Panel */}
            <div className="lg:col-span-1 space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                    <AlertTitle className="text-blue-800 flex items-center gap-2">
                        <InfoIcon className="h-4 w-4" />
                        About Sub-Subjects
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 mt-2 space-y-2">
                        <p>Sub-subjects help organize content under broader subjects.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Example: <strong>Math</strong> → <strong>Algebra</strong></li>
                            <li>Example: <strong>Science</strong> → <strong>Physics</strong></li>
                        </ul>
                    </AlertDescription>
                </Alert>

                <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Naming Guidelines</h3>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Use specific, descriptive names</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Avoid generic terms like "Advanced" or "Basic"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Keep names concise (2-3 words)</span>
                        </li>
                    </ul>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Preview</h3>
                    <div className="text-sm">
                        {form.watch("name") ? (
                            <div className="space-y-1">
                                <p className="font-medium">{form.watch("subjectId")
                                    ? subjects.find(s => s.id === form.watch("subjectId"))?.name
                                    : "[Subject]"}</p>
                                <p className="text-muted-foreground">→ {form.watch("name")}</p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">Name will appear here</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}