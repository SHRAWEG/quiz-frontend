"use client"

import { ClientSideDataTable } from "@/components/shared/client-data-table/data-table"
import { useDeleteSubSubject, useGetAllSubSubjects } from "@/hooks/api/useSubSubject";
import { Subject } from "@/types/subject";
import { SubSubject } from "@/types/subSubject";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

const columns = [
    {
        accessorKey: "subject.name", 
        header: "Subject"
    },
    {
        accessorKey: "name",
        header: "Name"
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

                router.push("/sub-subjects");
            },

            onError: (error: Error) => {
                console.log(error);
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