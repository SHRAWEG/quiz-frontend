import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { questionTypes } from "@/enums/questions";
import { useGetQuestionSetDetail } from "@/hooks/api/useQuestionSet";
import { CheckCircleIcon, Edit, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function QuestionSetDetail() {
  const router = useRouter();

  const params = useParams()
  const questionSetId = params.id as string

  const { data, isFetching } = useGetQuestionSetDetail(questionSetId);

  const [search, setSearch] = useState("");

  const filteredQuestions = data?.questions.filter((question) => {
    if (!search) return true;

    const query = search.toLowerCase();

    return (
      question.question.toLowerCase().includes(query) ||
      question.subject.name.toLowerCase().includes(query) ||
      question.subSubject.name.toLowerCase().includes(query)
    );
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  if (isFetching) return <Loader2 className="animate-spin" />

  return (
    <div className="container mx-auto px-4">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex flex-wrap justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <span className="bg-primary/10 p-2 rounded-lg">
              <span className="text-primary">🏷️</span>
            </span>
            {data?.name}
          </h1>
          <Button variant="outline" size="sm" onClick={() => router.push(`/question-sets/update/${questionSetId}`)}><Edit />Edit</Button>
        </div>


        <div className="flex flex-wrap gap-4 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
            Category: {data?.category?.name || "General"}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${data?.isFree ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"}`}>
            {data?.isFree ? "Free" : "Paid"}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${data?.status == 'published' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {data?.status === "published" ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex flex-col gap-2">
            <span className="text-sm text-neutral-700 font-bold">Created by: {`${data?.createdBy?.firstName ?? "Admin"} ${data?.createdBy?.middleName ?? "Quiz"} ${data?.createdBy?.lastName ?? "User"}`} • {data?.createdBy?.email ?? "admin@quizit.com"}</span>
            <span className="text-sm text-neutral-700 font-bold">Created at: {data?.createdAt?.toString() ?? '2025-05-03 11:34:58'}</span>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>• {data?.questions.length} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>3.8★ Rating (142 votes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>1.2K views</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-700">Created by: {`${data?.createdBy?.firstName ?? "Admin"} ${data?.createdBy?.middleName ?? "Quiz"} ${data?.createdBy?.lastName ?? "User"}`} • {data?.createdBy?.email ?? "admin@quizit.com"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-700">Created at: {data?.createdAt?.toString() ?? '2025-05-03 11:34:58'}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/question-sets/update/${questionSetId}`)}><Edit />Edit</Button>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>

      {/* Questions Section */}
      <div className="mb-6">
        <Input
          placeholder="🔍 Search questions..."
          className="max-w-md mb-6"
          onChange={handleSearch}
        />

        <div className="space-y-4">
          {filteredQuestions?.map((question, index) => {
            return (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{index + 1}. {question.question}</h3>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <span className="text-sm text-muted-foreground">• {questionTypes.find(x => x.value == question.type)?.label}</span>
                    <span className="text-sm text-muted-foreground">• {question.subject.name} → {question.subSubject.name} </span>
                    <span className="text-sm text-muted-foreground">• Difficulty: {question.difficulty}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {question.type === "mcq" && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Options:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, index) =>
                          <div key={option.id} className={`flex flex-wrap justify-between p-2 rounded ${option.isCorrect && "bg-green-50 text-green-600 font-bold"}`}>
                            <span>{String.fromCharCode(65 + index)}. {option.option}</span>
                            {option.isCorrect && <CheckCircleIcon />}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}