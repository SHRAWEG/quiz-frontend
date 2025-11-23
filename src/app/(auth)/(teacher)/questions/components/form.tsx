'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { QUESTION_TYPES } from "@/constants/questions";
import { QuestionFormData } from "../create/page";
import { QuestionReqDto } from "@/types/question";
import { questionTypes } from "@/enums/question-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Subject } from "@/types/subject";
import { SubSubject } from "@/types/sub-subject";
import { UseFormReturn } from "react-hook-form";
import CustomEditorLoader from "@/components/ck-editor/custom-editor-loader";
import EditorPreviewLoader from "@/components/ck-editor/editer-preview-loader";

interface QuestionFormProps {
  onSubmit: (data: QuestionReqDto, redirect: boolean, callback?: () => void) => void;
  subjectChange: (subjectId: string) => void;
  isPending: boolean;
  initialValues?: Partial<QuestionReqDto & { subjectId: string }>;
  subjects: Subject[];
  subSubjects: SubSubject[];
  form: UseFormReturn<QuestionFormData>;
  isUpdate?: boolean;
}

export function QuestionForm({
  onSubmit,
  subjectChange,
  isPending,
  subjects,
  subSubjects,
  form,
  isUpdate = false
}: QuestionFormProps) {
  const handleSaveAndAddMore = () => {
    const data = form.getValues();

    const apiData: QuestionReqDto = {
      type: data.type,
      subSubjectId: data.subSubjectId,
      questionText: data.questionText,
      options: data.options,
      correctAnswerBoolean: data.correctAnswerBoolean,
      correctAnswerText: data.correctAnswerText,
      difficulty: data.difficulty
    };

    onSubmit(apiData, false, () => {
      form.reset({
        type: data.type,
        subjectId: data.subjectId,
        subSubjectId: data.subSubjectId,
        questionText: "",
        options: [],
        correctAnswerBoolean: undefined,
        correctAnswerText: "",
        difficulty: 3
      });
    });
  };

  const handleSaveAndRedirect = () => {
    const data = form.getValues();
    const apiData: QuestionReqDto = {
      type: data.type,
      subSubjectId: data.subSubjectId,
      questionText: data.questionText,
      options: data.options,
      correctAnswerBoolean: data.correctAnswerBoolean,
      correctAnswerText: data.correctAnswerText,
      difficulty: data.difficulty
    };
    onSubmit(apiData, true);
  };


  const questionType = form.watch("type");
  const currentSubjectId = form.watch("subjectId");
  const currentSubSubjectId = form.watch("subSubjectId");

  const shouldShowError = (fieldName: keyof QuestionFormData) => {
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
          {/* Question Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-medium">Question Type</FormLabel>
                </div>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === "mcq") {
                      form.setValue("options", [
                        { optionText: "", isCorrect: false },
                        { optionText: "", isCorrect: false },
                        { optionText: "", isCorrect: false },
                        { optionText: "", isCorrect: false }
                      ]);
                      form.setValue("correctAnswerBoolean", undefined);
                      form.setValue("correctAnswerText", "");
                    } else if (value === "true-false") {
                      form.setValue("options", []);
                      form.setValue("correctAnswerText", "");
                    } else if (value === "fill-in-the-blanks") {
                      form.setValue("options", []);
                      form.setValue("correctAnswerBoolean", undefined);
                    } else {
                      form.setValue("options", []);
                      form.setValue("correctAnswerBoolean", undefined);
                      form.setValue("correctAnswerText", "");
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={`h-11 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${shouldShowError("type")
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-gray-300 focus-visible:ring-primary"
                      }`}>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {shouldShowError("type") && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.type?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Subject */}
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-medium">Subject</FormLabel>
                </div>
                {!currentSubjectId && !form.formState.isDirty && isUpdate ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      subjectChange(value);
                      form.resetField("subSubjectId");
                    }}
                    value={field.value}

                  >
                    <FormControl>
                      <SelectTrigger className={`h-11 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${shouldShowError("subjectId")
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-gray-300 focus-visible:ring-primary"
                        }`}>
                        <SelectValue placeholder="Select a subject" />
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
                )}
                <FormMessage />
                {shouldShowError("subjectId") && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.subjectId?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Sub-Subject */}
          <FormField
            control={form.control}
            name="subSubjectId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-medium">Sub-Subject</FormLabel>
                </div>
                {!currentSubSubjectId && !form.formState.isDirty ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={`h-11 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${shouldShowError("subSubjectId")
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-gray-300 focus-visible:ring-primary"
                        }`}>
                        <SelectValue placeholder="Select a sub-subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subSubjects.map((subSubject) => (
                        <SelectItem key={subSubject.id} value={subSubject.id}>
                          {subSubject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
                {shouldShowError("subSubjectId") && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.subSubjectId?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Question Text */}
          {/* 
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                  <FormItem>
                      <div className="flex items-center gap-2">
                          <FormLabel className="text-sm font-medium">Question Text</FormLabel>
                      </div>
                      <FormControl>
                          <Textarea
                              placeholder="Enter your question here..."
                              className={`h-11 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${shouldShowError("questionText")
                                  ? "border-destructive focus-visible:ring-destructive"
                                  : "border-gray-300 focus-visible:ring-primary"
                                  }`}
                              {...field}
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
            /> 
          */}
          <FormField
            control={form.control}
            name="questionText"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-medium">Question Text</FormLabel>
                </div>
                <FormControl>
                  <div className="w-full">
                    <CustomEditorLoader
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MCQ Options */}
          {questionType === QUESTION_TYPES.MCQ && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FormLabel className="text-sm font-medium">Options</FormLabel>
              </div>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name={`options.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            type="radio"
                            checked={field.value}
                            onChange={() => {
                              // Set all options to false first
                              const currentOptions = form.getValues("options") || [];
                              form.setValue("options", currentOptions.map((opt, i) => ({
                                ...opt,
                                isCorrect: i === index
                              })));
                            }} className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`options.${index}.optionText`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={`Option ${index + 1}`}
                            className={`h-11 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${shouldShowError("options")
                              ? "border-destructive focus-visible:ring-destructive"
                              : "border-gray-300 focus-visible:ring-primary"
                              }`}
                            {...field}
                          />
                        </FormControl>
                        {shouldShowError("options") && (
                          <FormMessage className="text-red-500">
                            {form.formState.errors.options?.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {/* True/False Option */}
          {questionType === QUESTION_TYPES.TRUE_FALSE && (
            <FormField
              control={form.control}
              name="correctAnswerBoolean"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm font-medium">Correct Answer</FormLabel>
                  </div>
                  {!currentSubSubjectId && !form.formState.isDirty ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        form.setValue("correctAnswerBoolean", value === "true");
                      }}
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {shouldShowError("options") && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.options?.message}
                    </FormMessage>
                  )}

                </FormItem>
              )}
            />
          )}

          {questionType === QUESTION_TYPES.FILL_IN_THE_BLANKS && (
            <FormField
              control={form.control}
              name="correctAnswerText"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm font-medium">Correct Answer</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Answer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Difficulty */}
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-medium">Difficulty Level</FormLabel>
                </div>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className={`h-11 w-full rounded-md border bg-white text-sm shadow-sm focus:outline-none ${shouldShowError("difficulty")
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-gray-300 focus-visible:ring-primary"
                        }`}
                    />
                  </FormControl>
                  <span className="text-sm font-medium">{field.value}/5</span>
                </div>
                <FormMessage />
                {shouldShowError("difficulty") && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.difficulty?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <CardFooter className="flex gap-2 justify-end px-0 pb-0">
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

      {/* Right Column - Information Panel */}
      <div className="flex flex-col gap-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800 flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            Question Creation Guidelines
          </AlertTitle>
          <AlertDescription className="text-blue-700 mt-2 space-y-2">
            <p>Follow these best practices when creating questions:</p>
            <ul className="flex flex-col list-disc pl-5 gap-1">
              <li>Ensure questions are clear and unambiguous</li>
              <li>Maintain consistent difficulty levels</li>
              <li>Use proper grammar and punctuation</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="border rounded-lg p-4 bg-muted/50">
          <h3 className="font-medium mb-2">Question Type Tips</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>MCQ:</strong> Provide 4 distinct options with one clear correct answer</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>Short Answer:</strong> Specify expected keywords in the correct answer</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>True/False:</strong> Avoid ambiguous statements</span>
            </li>
          </ul>
        </div>

        <div className="border rounded-lg p-4 bg-muted/50">
          <h3 className="font-medium mb-2">Difficulty Levels</h3>
          <ul className="flex flex-col text-sm gap-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span>1-2:</span>
              <span>Basic recall or understanding</span>
            </li>
            <li className="flex items-start gap-2">
              <span>3:</span>
              <span>Application of knowledge</span>
            </li>
            <li className="flex items-start gap-2">
              <span>4-5:</span>
              <span>Analysis or synthesis of concepts</span>
            </li>
          </ul>
        </div>

        <div className="border rounded-lg p-4 bg-muted/50">
          <h3 className="font-medium mb-2">Preview</h3>
          <div className="text-sm">
            <p className="font-medium">
              {form.watch("subjectId")
                ? subjects.find(s => s.id === form.watch("subjectId"))?.name
                : "[Subject]"}
              {form.watch("subSubjectId") && ` → ${subSubjects.find(s => s.id === form.watch("subSubjectId"))?.name}`}
            </p>


            {form.watch("questionText") ? (
              <div className="">
                <EditorPreviewLoader
                  className="max-h-[500px] overflow-y-auto"
                  data={form.watch("questionText")}
                />
                {questionType === "mcq" && form.watch("options")?.some(o => o.optionText) && (
                  <div className="mt-2 space-y-1">
                    <p className="text-muted-foreground">Options:</p>
                    <ul className="list-disc pl-5">
                      {form.watch("options")?.map((opt, i) => (
                        opt.optionText && (
                          <li key={i} className={opt.isCorrect ? "text-green-600 font-medium" : ""}>
                            {opt.optionText} {opt.isCorrect && "(Correct)"}
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                )}
                {questionType === "TRUE_FALSE" && (
                  <p className="mt-2 text-muted-foreground">
                    Correct Answer: {form.watch("options")?.[0]?.isCorrect ? "True" : "False"}
                  </p>
                )}
                <p className="mt-2 text-muted-foreground">
                  Difficulty: {form.watch("difficulty")}/5
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground italic">Question details will appear here</p>
            )}

            {/* {
              form.watch("questionText") ? (
                <div>
                  <p className="font-semibold">Q: {form.watch("questionText")}</p>
                  {questionType === "mcq" && form.watch("options")?.some(o => o.optionText) && (
                    <div className="mt-2 space-y-1">
                      <p className="text-muted-foreground">Options:</p>
                      <ul className="list-disc pl-5">
                        {form.watch("options")?.map((opt, i) => (
                          opt.optionText && (
                            <li key={i} className={opt.isCorrect ? "text-green-600 font-medium" : ""}>
                              {opt.optionText} {opt.isCorrect && "(Correct)"}
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  )}
                  {questionType === "TRUE_FALSE" && (
                    <p className="mt-2 text-muted-foreground">
                      Correct Answer: {form.watch("options")?.[0]?.isCorrect ? "True" : "False"}
                    </p>
                  )}
                  <p className="mt-2 text-muted-foreground">
                    Difficulty: {form.watch("difficulty")}/5
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">Question details will appear here</p>
              )
            } */}

          </div>
        </div>
      </div>
    </div>
  );
}