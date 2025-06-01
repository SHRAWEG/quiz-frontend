import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types/category";
import { QuestionSetReqDto } from "@/types/question-set";
import { UseFormReturn } from "react-hook-form";
import { CardFooter } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FormProps {
  onSubmit: (data: QuestionSetReqDto) => void;
  isPending: boolean;
  categories: Category[];
  form: UseFormReturn<QuestionSetReqDto>;
  isUpdate?: boolean;
}

export function QuestionSetForm({ onSubmit, isPending, categories, form, isUpdate }: FormProps) {
  const isTimeLimited = form.watch("isTimeLimited");
  const categoryId = form.watch("categoryId");

  const secondsToTime = (seconds: number) => ({
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60
  });

  const timeToSeconds = (hours: number, minutes: number, seconds: number) =>
    (hours * 3600) + (minutes * 60) + seconds;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Category Field */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                {!categoryId && !form.formState.isDirty && isUpdate ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
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

          {/* Title Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Quiz title"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Free Field */}
          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Type</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3 h-10 p-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <span className="text-sm font-medium">
                      {field.value ? "Free for everyone" : "Paid access"}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Timer Toggle */}
          <FormField
            control={form.control}
            name="isTimeLimited"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Limit</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3 h-10 p-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <span className="text-sm font-medium">
                      {field.value ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Input (shown when timer enabled) */}
          {isTimeLimited && (
            <FormField
              control={form.control}
              name="timeLimitSeconds"
              render={({ field }) => {
                const { hours, minutes, seconds } = secondsToTime(field.value || 0);

                return (
                  <FormItem className="space-y-2 md:col-span-2">
                    <FormLabel>Duration</FormLabel>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-center gap-2">
                        <div className="relative w-24">
                          <Input
                            type="number"
                            min="0"
                            value={hours}
                            onChange={(e) => {
                              const newHours = parseInt(e.target.value) || 0;
                              field.onChange(timeToSeconds(newHours, minutes, seconds));
                            }}
                            className="pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            h
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative w-24">
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => {
                              const newMinutes = Math.min(59, parseInt(e.target.value) || 0);
                              field.onChange(timeToSeconds(hours, newMinutes, seconds));
                            }}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            m
                          </span>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
        </div>

        <CardFooter className="flex justify-end px-0 pb-0 pt-6">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? "Saving..." : isUpdate ? "Save Changes" : "Next"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}