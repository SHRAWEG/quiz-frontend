import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Subject } from "@/types/subject";
import { subSubjectReqDto, SubSubjectReqDto } from "@/types/subSubject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface FormProps {
    onSubmit: (data: SubSubjectReqDto) => void;
    isPending: boolean;
    initialValues?: SubSubjectReqDto;
    subjects: Subject[];
}

export function SubSubjectForm(props: FormProps) {
    const form = useForm<SubSubjectReqDto>({
        resolver: zodResolver(subSubjectReqDto),
        defaultValues: {
            subjectId: props.initialValues?.subjectId || "",
            name: props.initialValues?.name || "",
        },
        mode: "onBlur",
        criteriaMode: "all",
    });

    // Helper function to determine if we should show an error
    const shouldShowError = (fieldName: keyof SubSubjectReqDto) => {
        return (
            form.formState.touchedFields[fieldName] &&
            form.formState.errors[fieldName]
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(props.onSubmit)} className="w-full max-w-sm space-y-6 mx-8">
                <FormField
                    control={form.control}
                    name="subjectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {props.subjects.map((subject) => (
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={props.isPending}
                >
                    {props.isPending ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Form>
    )
}
