import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { subjectReqDto, SubjectReqDto } from "@/dtos/master/subject.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface FormProps {
    onSubmit: (data: SubjectReqDto) => void;
    initialValues?: SubjectReqDto;
}


export function SubjectForm(props: FormProps) {
    const form = useForm<SubjectReqDto>({
        resolver: zodResolver(subjectReqDto),
        defaultValues: {
            name: props.initialValues?.name || "",
        },
        mode: "onBlur",
        criteriaMode: "all",
    });

    // Helper function to determine if we should show an error
    const shouldShowError = (fieldName: keyof SubjectReqDto) => {
        return (
            form.formState.touchedFields[fieldName] &&
            form.formState.errors[fieldName]
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(props.onSubmit)} className="w-full max-w-sm space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )

}