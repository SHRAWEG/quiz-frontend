import { Button } from "@/components/ui/button";
import FullPageLoader from "@/components/ui/full-page-loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetSubjectDetail } from "@/hooks/api/useSubject";
import { useDeleteSubSubject } from "@/hooks/api/useSubSubject";
import { ApiError } from "@/lib/axios";
import { Edit, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SubjectDetailPage() {
  const params = useParams()
  const router = useRouter();
  const subjectId = params.id as string

  const { data, isFetching, refetch } = useGetSubjectDetail(subjectId);
  const { mutate: deleteSubSubject } = useDeleteSubSubject();

  const handleDelete = (id: string) => {
    deleteSubSubject({ subSubjectId: id }, {
      onSuccess: () => {
        refetch();
        toast.success("Sub Subject deleted successfully!");
      },

      onError: (error: ApiError) => {
        toast.error(error.data.message);
      }
    });

  }

  if (isFetching) {
    return <FullPageLoader />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1 items-center border-b-2 pb-4">
        <div className="text-2xl text-muted-foreground">Subject:</div>
        <div className="text-2xl font-bold">{data?.name}</div>
      </div>
      <div className="flex flex-wrap justify-between">
        <div className="text-lg text-muted-foreground">Sub-Subjects:</div>
        <Button variant="default" onClick={() => router.push(`/subjects/${subjectId}/create-sub-subject`)}>Create Sub-Subject</Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table className="w-full">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.subSubjects.map((subSubject) => (
              <TableRow key={subSubject.id}>
                <TableCell>
                  {subSubject.name}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="default" onClick={() => router.push(`/subjects/${subjectId}/update-sub-subject/${subSubject.id}`)}>
                    <Edit />
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(subSubject.id)}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div >
  );
}