"use client"

import { ClientSideDataTable } from "@/components/shared/client-data-table/data-table"
import { useDeleteSubject, useGetAllSubjects } from "@/hooks/api/useSubject"
import { Subject } from "@/types/subject";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const columns = [
    {
        accessorKey: "name",
        header: "Name"
    }

]

export default function List() {
    const { data, isFetched } = useGetAllSubjects();
    const router = useRouter();
    const { mutate: deleteSubject } = useDeleteSubject();
    const { refetch } = useGetAllSubjects();

    const handleDelete = (id: string) => {
        deleteSubject({ subjectId: id }, {
            onSuccess: () => {
                refetch();
                toast.success("Subject deleted successfully");
            },

            onError: (error: Error) => {
                toast.error(error.message);
            }
        });

    }

    return (
        <ClientSideDataTable
            columns={columns}
            data={data || []}
            enableColumnVisibility={true}
            enableSorting={true}
            enableFiltering={true}
            enablePagination={true}
            isFetched={isFetched}
            actions={[
                {
                    id: "edit",
                    label: "Edit",
                    icon: Edit,
                    action: (data: Subject) => {
                        router.push(`/subjects/update/${data.id}`)
                    }
                },
                {
                    id: "delete",
                    label: "Delete",
                    icon: Trash,
                    action: (data: Subject) => {
                        handleDelete(data.id)
                    },
                    variant: "destructive"
                }
            ]}
        />
    )
}