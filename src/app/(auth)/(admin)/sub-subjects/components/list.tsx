"use client"

import { ClientSideDataTable } from "@/components/shared/client-data-table/data-table"
import { useDeleteSubSubject, useGetAllSubSubjects } from "@/hooks/api/useSubSubject";
import { ApiError } from "@/lib/axios";
import { SubSubject } from "@/types/sub-subject";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const columns = [
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "subject.name",
        header: "Subject"
    }
]

export default function List() {
    const { data, isFetched, refetch } = useGetAllSubSubjects();
    const router = useRouter();
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
                    action: (data: SubSubject) => {
                        router.push(`/sub-subjects/update/${data.id}`)
                    }
                },
                {
                    id: "delete",
                    label: "Delete",
                    icon: Trash,
                    action: (data: SubSubject) => {
                        handleDelete(data.id)
                    },
                    variant: "destructive"
                }
            ]}
        />
    )
}