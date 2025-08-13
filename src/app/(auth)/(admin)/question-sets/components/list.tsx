import { DataTable } from "@/components/shared/server-data-table/data-table";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  QuestionSetParams,
  useDeleteQuestionSet,
  useDraftQuestionSet,
  useGetQuestionSets,
  usePublishQuestionSet,
} from "@/hooks/api/useQuestionSet";
// import { useGetAllCategories } from "@/hooks/api/useCategory";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { getColumns } from "./columns";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // const [categoryId, setCategoryId] = useState("");
  const [tableState, setTableState] = useState({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [] as { id: string; desc: boolean }[],
  });

  const params: QuestionSetParams = {
    page: tableState.pagination.pageIndex + 1,
    limit: tableState.pagination.pageSize,
    search: searchTerm,
    categoryId: "",
  };

  // const { data: categories } = useGetAllCategories();
  const { data, refetch, isFetching } = useGetQuestionSets(params);
  const { mutate: deleteQuestionSet } = useDeleteQuestionSet();
  const { mutate: publishQuestionSet, isPending: isPublishPending } =
    usePublishQuestionSet();
  const { mutate: draftQuestionSet, isPending: isDraftPending } =
    useDraftQuestionSet();
  const [pendingId, setPendingId] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch, tableState]);

  // const handleCategoryChange = (value: string) => {
  //   if (value === "all") {
  //     setCategoryId("");
  //   } else {
  //     setCategoryId(value);
  //   }
  // }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const handlePaginationChange = (pagination: any) => {
    setTableState((prev) => ({ ...prev, pagination }));
  };

  const handleDelete = (questionSetId: string) => {
    deleteQuestionSet(
      { questionSetId },
      {
        onSuccess: () => {
          refetch();
          toast.success("Deleted successfully.");
        },
        onError: (error: ApiError) => {
          toast.error(error.data.message);
        },
      }
    );
  };

  const handlePublishQuestionSet = (questionSetId: string) => {
    setPendingId(questionSetId);
    publishQuestionSet(
      { questionSetId },
      {
        onSuccess: () => {
          refetch();
          toast.success("Question-set published successfully.");
        },
        onError: (error: ApiError) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleDraftQuestionSet = (questionSetId: string) => {
    setPendingId(questionSetId);
    draftQuestionSet(
      { questionSetId },
      {
        onSuccess: () => {
          refetch();
          toast.success("Question-set set to draft.");
        },
        onError: (error: ApiError) => {
          toast.error(error.message);
        },
      }
    );
  };

  const tableColumns = getColumns(
    handleDelete,
    handlePublishQuestionSet,
    handleDraftQuestionSet,
    isDraftPending || isPublishPending,
    pendingId
  );

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <Input
          placeholder="Search question sets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
          disabled={isFetching}
        />
        {/* <Select onValueChange={handleCategoryChange} value={categoryId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <Button variant="default" type="submit">
          Filter
        </Button>
      </form>
      <DataTable
        columns={tableColumns}
        data={data?.data || []}
        pageCount={data?.totalPages ?? 0}
        totalItems={data?.totalItems ?? 0}
        isLoading={isFetching}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
