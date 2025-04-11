import { ClientSideDataTable } from "@/components/shared/client-data-table/data-table"
import { useGetAllSubjects } from "@/hooks/api/useSubject"

const columns = [
    {
        accessorKey: "name",
        header: "Name",
    }
]

export default function List() {
    const { data } = useGetAllSubjects();

    

    return (
        <ClientSideDataTable
            columns={columns}
            data={data?.data || []}
            enableColumnVisibility={true}
            enableSorting={true}
            enableFiltering={true}
            enablePagination={true}
        />
    )
}