import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CategoryReqDto } from "@/types/category";
import { UseFormReturn } from "react-hook-form";
import { CardFooter } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormProps {
    onSubmit: (data: CategoryReqDto, redirect: boolean) => void;
    isPending: boolean;
    form: UseFormReturn<CategoryReqDto>;
    isUpdate?: boolean;
}

export function CategoryForm({ onSubmit, isPending, form, isUpdate }: FormProps) {
    const handleSaveAndAddMore = () => {
        onSubmit(form.getValues(), false); // Call the onSubmit function with the current form values
    };

    const handleSaveAndRedirect = () => {
        onSubmit(form.getValues(), true); // Call the onSubmit function with the current form values
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveAndRedirect)} className="space-y-6">
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
                                        placeholder="e.g., Loksewa, Quiz, Practice"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <CardFooter className="flex justify-end px-0 pb-0 space-x-4">
                        {isUpdate ? <Button
                            type="submit"
                            disabled={isPending}
                            className="min-w-[120px]"
                        >
                            {isPending ? "Saving..." : "Save"}
                        </Button> :
                            <>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="min-w-[120px]"
                                >
                                    {isPending ? "Saving..." : "Save & Redirect"}
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
                        }
                    </CardFooter>
                </form>
            </Form>

            {/* Right Column - Information Panel */}
            <div className="lg:col-span-1 space-y-4">
                {/* About Categories Alert */}
                <Alert className="bg-blue-50 border-blue-200">
                    <AlertTitle className="text-blue-800 flex items-center gap-2">
                        <InfoIcon className="h-4 w-4" />
                        About Categories
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 mt-2 space-y-2">
                        <p>Categories define the purpose or type of your question set.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Example: <strong>Loksewa</strong> (for civil service prep)</li>
                            <li>Example: <strong>Quiz</strong> (general knowledge tests)</li>
                            <li>Example: <strong>Practice</strong> (learning exercises)</li>
                        </ul>
                    </AlertDescription>
                </Alert>

                {/* Naming Guidelines */}
                <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Category Rules</h3>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Use specific purpose-based labels</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Capitalize names (e.g., "Loksewa")</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Keep them short (1-2 words max)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>Use consistent naming (e.g., always "Quiz" not "Quizzes")</span>
                        </li>
                    </ul>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Preview</h3>
                    <div className="text-sm">
                        {form.watch("name") ? (
                            <p className="font-medium">{form.watch("name")}</p>
                        ) : (
                            <p className="text-muted-foreground italic">Category name will appear here</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}