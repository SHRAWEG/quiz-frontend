import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubscriptionPlanReqDto } from "@/types/subscription-plan";
import { UseFormReturn } from "react-hook-form";
import { CardFooter } from "@/components/ui/card";
import { subscriptionDuration } from "@/enums/subscription-duration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FormProps {
  onSubmit: (data: SubscriptionPlanReqDto, redirect: boolean) => void;
  isPending: boolean;
  form: UseFormReturn<SubscriptionPlanReqDto>;
  isUpdate?: boolean;
}

export function SubscriptionPlanForm({
  onSubmit,
  isPending,
  form,
  isUpdate,
}: FormProps) {
  const handleSaveAndAddMore = () => {
    onSubmit(form.getValues(), false);
  };

  const handleSaveAndRedirect = () => {
    onSubmit(form.getValues(), true);
  };

  const shouldShowError = (fieldName: keyof SubscriptionPlanReqDto) => {
    return (
      form.formState.touchedFields[fieldName] &&
      form.formState.errors[fieldName]
    );
  };

  console.log("Form values:", form.getValues());

  // Get the duration display text
  const getDurationDisplay = (value: string) => {
    const duration = subscriptionDuration.find((d) => d.value === value);
    if (!duration) return "";

    // Custom display format
    if (value === "monthly") return "1 Month";
    if (value === "quarterly") return "3 Months";
    if (value === "semi_annually") return "6 Months";
    if (value === "yearly") return "1 Year";
    return duration.label;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSaveAndRedirect)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => {
              // Convert undefined/null to empty string for the Select component
              const selectValue = field.value || "";

              return (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm font-medium">
                      Duration
                    </FormLabel>
                  </div>
                  <Select
                    onValueChange={(value) => {
                      // Only update if value changed
                      if (value !== selectValue) {
                        field.onChange(value);
                      }
                    }}
                    value={selectValue}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`h-11 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                          shouldShowError("duration")
                            ? "border-destructive focus-visible:ring-destructive"
                            : "border-gray-300 focus-visible:ring-primary"
                        }`}
                      >
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
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-medium">
                    Plan Name
                  </FormLabel>
                </div>
                <FormControl>
                  <Input placeholder="e.g., Monthly, Annual, etc." {...field} />
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
                  <FormLabel className="text-sm font-medium">
                    Plan Description
                  </FormLabel>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Enter a brief description of the plan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                    placeholder="Enter price"
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange(isNaN(value) ? "" : value);
                    }}
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
            )}
          </CardFooter>
        </form>
      </Form>
      {/* Right Column - Preview */}
      <div>
        <Card className="relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <CardHeader className="pb-4 h-24">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">
                {form.watch("name") || "Plan Name"}
              </CardTitle>
            </div>
            <p className="text-muted-foreground">
              {form.watch("description") || "Plan description"}
            </p>
          </CardHeader>

          <Separator className="my-4" />

          <CardContent className="pb-6">
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  NPR{" "}
                  {typeof form.watch("price") === "number"
                    ? form.watch("price").toFixed(2)
                    : "0.00"}
                </span>
                {form.watch("duration") && (
                  <span className="text-muted-foreground">
                    / {getDurationDisplay(form.watch("duration"))}
                  </span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              variant={"default"}
              disabled={true}
            >
              Select
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
