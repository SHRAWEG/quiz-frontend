"use client"

import { ClientSideDataTable } from "@/components/shared/client-data-table/data-table"
import { useDeleteCategory, useGetAllCategories } from "@/hooks/api/useCategory"
import { Category } from "@/types/category";
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
    const { data, isFetched } = useGetAllCategories();
    const router = useRouter();
    const { mutate: deleteCategory } = useDeleteCategory();
    const { refetch } = useGetAllCategories();

    const handleDelete = (id: string) => {
        deleteCategory({ categoryId: id }, {
            onSuccess: () => {
                refetch();
                toast.success("Category deleted successfully");
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
                    action: (data: Category) => {
                        router.push(`/categories/update/${data.id}`)
                    }
                },
                {
                    id: "delete",
                    label: "Delete",
                    icon: Trash,
                    action: (data: Category) => {
                        handleDelete(data.id)
                    },
                    variant: "destructive"
                }
            ]}
        />
    )
}