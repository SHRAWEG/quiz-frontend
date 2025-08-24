"use client"

import { DataTable } from "@/components/shared/server-data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";
import { useGetTeachers, UserListParams } from "@/hooks/api/useUserList";
import { TeacherProfileModal } from "./teacher-profile-modal";
import { User } from "@/types/user";

export default function List() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tableState, setTableState] = useState({
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [] as { id: string; desc: boolean }[],
    });
    const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const params: UserListParams = {
        page: tableState.pagination.pageIndex + 1,
        limit: tableState.pagination.pageSize,
        search: searchTerm
    }

    const { data, isFetching, refetch } = useGetTeachers(params);

    useEffect(() => { refetch() }, [refetch, tableState])

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        refetch();
    }

    const handlePaginationChange = (pagination: any) => {
        setTableState(prev => ({ ...prev, pagination }));
    };

    const handleViewProfile = (user: User) => {
        setSelectedTeacher(user);
        setIsProfileModalOpen(true);
    };

    const tableColumns = getColumns(handleViewProfile);

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
                <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3"
                    disabled={isFetching}
                />

                <Button variant="default" type="submit">Filter</Button>
            </form>
            <DataTable
                columns={tableColumns}
                data={data?.data || []}
                pageCount={data?.totalPages ?? 0}
                totalItems={data?.totalItems ?? 0}
                isLoading={isFetching}
                onPaginationChange={handlePaginationChange}
            />

            <TeacherProfileModal
                user={selectedTeacher}
                open={isProfileModalOpen}
                onOpenChange={setIsProfileModalOpen}
            />
        </div>
    )
}