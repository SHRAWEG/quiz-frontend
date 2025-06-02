import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Subject } from "@/types/subject";
import { SubSubjectReqDto } from "@/types/sub-subject";
import { UseFormReturn } from "react-hook-form";
import { CardFooter } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubjectDetail } from "@/hooks/api/useSubject";

interface FormProps {
    subjectId: string;
    onSubmit: (data: SubSubjectReqDto, redirect: boolean, callback?: () => void) => void;
    isPending: boolean;
    subjects: Subject[];
    form: UseFormReturn<SubSubjectReqDto>;
    isUpdate?: boolean;
}

export function SubSubjectForm({ subjectId, onSubmit, isPending, subjects, form, isUpdate }: FormProps) {
    const { data: subject, isFetching } = useGetSubjectDetail(subjectId);

    const handleSaveAndAddMore = () => {
        onSubmit(form.getValues(), false, () => {
            form.reset({
                subjectId: subjectId,
                name: ""
            });
        });
    };

    const handleSaveAndRedirect = () => {
        onSubmit(form.getValues(), true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subject Name */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-md font-semibold">Subject: </h2>
                    {isFetching && <Skeleton className="w-24 h-4" />}
                    {!isFetching && subject && (
                        <span className="text-lg font-bold">
                            {subject.name}
                        </span>
                    )}
                </div>
                {/* Left Column - Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSaveAndRedirect)} className="space-y-6">
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
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <CardFooter className="flex justify-end px-0 pb-0 space-x-4">
                            {isUpdate ? (
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="min-w-[120px]"
                                >
                                    {isPending ? "Saving..." : "Save"}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="min-w-[120px]"
                                    >
                                        {isPending ? "Saving..." : "Save"}
                                    </Button>
                                    <Button
                                        type="button"
                                        disabled={isPending}
                                        onClick={handleSaveAndAddMore}
                                        className="min-w-[120px]"
                                    >
                                        {isPending ? "Saving..." : "Save & Add More"}
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </form>
                </Form>
            </div>

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
                                <p className="font-medium">
                                    {subjectId
                                        ? subjects.find(s => s.id === subjectId)?.name
                                        : "[Subject]"}
                                </p>
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