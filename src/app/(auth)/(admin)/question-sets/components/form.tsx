import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types/category";
import { QuestionSetReqDto } from "@/types/question-set";
import { UseFormReturn } from "react-hook-form";
import { CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FormProps {
  onSubmit: (data: QuestionSetReqDto) => void;
  isPending: boolean;
  categories: Category[];
  form: UseFormReturn<QuestionSetReqDto>;
  isUpdate?: boolean;
}

export function QuestionSetForm({ onSubmit, isPending, categories, form, isUpdate }: FormProps) {

  // Get the current categoryId value from the form
  const categoryId = form.watch("categoryId");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-medium">Category</FormLabel>
                </div>
                {!categoryId && !form.formState.isDirty && isUpdate ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
                  <FormLabel className="text-sm font-medium">Title</FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel className="text-sm font-medium">Is Free?</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <CardFooter className="flex justify-end px-0 pb-0 space-x-4">
          <Button
            type="submit"
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending ? "Saving..." : isUpdate ? "Save" : "Next"}
          </Button>
        </CardFooter>
      </form>
    </Form >
  );
}