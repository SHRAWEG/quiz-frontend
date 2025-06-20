import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubscriptionPlanReqDto } from "@/types/subscription-plan";
import { UseFormReturn } from "react-hook-form";
import { CardFooter } from "@/components/ui/card";
import { subscriptionDuration } from "@/enums/subscription-duration";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormProps {
    onSubmit: (data: SubscriptionPlanReqDto, redirect: boolean) => void;
    isPending: boolean;
    form: UseFormReturn<SubscriptionPlanReqDto>;
    isUpdate?: boolean;
}

export function CategoryForm({ onSubmit, isPending, form, isUpdate }: FormProps) {
    const handleSaveAndAddMore = () => {
        onSubmit(form.getValues(), false); // Call the onSubmit function with the current form values
    };

    const handleSaveAndRedirect = () => {
        onSubmit(form.getValues(), true); // Call the onSubmit function with the current form values
    };

    const shouldShowError = (fieldName: keyof SubscriptionPlanReqDto) => {
        return (
            form.formState.touchedFields[fieldName] &&
            form.formState.errors[fieldName]
        );
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
                                    <FormLabel className="text-sm font-medium">Plan Name</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Monthly, Annual, etc."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium">Plan Description</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Monthly, Annual, etc."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium">Question Type</FormLabel>
                                </div>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className={`h-11 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${shouldShowError("duration")
                                            ? "border-destructive focus-visible:ring-destructive"
                                            : "border-gray-300 focus-visible:ring-primary"
                                            }`}>
                                            <SelectValue placeholder="Select plan duration" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subscriptionDuration.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                {shouldShowError("duration") && (
                                    <FormMessage className="text-red-500">
                                        {form.formState.errors.duration?.message}
                                    </FormMessage>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium">Price</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Monthly, Annual, etc."
                                        type="number"
                                        {...field}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            field.onChange(isNaN(value) ? 0 : value);
                                        }}
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
        </div>
    );
}