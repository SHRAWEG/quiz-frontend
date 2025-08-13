"use client";

import { DataTable } from "@/components/shared/server-data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SubscriptionPlanParams,
  useActivateSubscriptionPlan,
  useDeactivateSubscriptionPlan,
  useGetSubscriptionPlans,
} from "@/hooks/api/useSubscriptionPlan";
// import { ApiError } from "@/lib/axios";
import { useEffect, useState } from "react";
// import { toast } from "sonner";
import { getColumns } from "./columns";
import { toast } from "sonner";

export default function List() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tableState, setTableState] = useState({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [] as { id: string; desc: boolean }[],
  });
  const [pendingId, setPendingId] = useState("");

  const params: SubscriptionPlanParams = {
    page: tableState.pagination.pageIndex + 1,
    limit: tableState.pagination.pageSize,
    search: searchTerm,
  };

  const { data, isFetching, refetch } = useGetSubscriptionPlans(params);
  const { mutate: markACtive, isPending: isMarkActivePending } =
    useActivateSubscriptionPlan();
  const { mutate: markInactive, isPending: isMarkInactivePending } =
    useDeactivateSubscriptionPlan();

  useEffect(() => {
    refetch();
  }, [refetch, tableState]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const handlePaginationChange = (pagination: any) => {
    setTableState((prev) => ({ ...prev, pagination }));
  };

  const handleMarkActive = (subscriptionPlanId: string) => {
    setPendingId(subscriptionPlanId);
    markACtive(
      { subscriptionPlanId },
      {
        onSuccess: () => {
          refetch();
          toast.success("Subscription plan activated successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to activate subscription plan");
        },
      }
    );
  };

  const handleMarkInactive = (subscriptionPlanId: string) => {
    setPendingId(subscriptionPlanId);
    markInactive(
      { subscriptionPlanId },
      {
        onSuccess: () => {
          refetch();
          toast.success("Subscription plan deactivated successfully");
        },
        onError: (error) => {
          toast.error(
            error.message || "Failed to deactivate subscription plan"
          );
        },
      }
    );
  };

  const tableColumns = getColumns(
    handleMarkActive,
    handleMarkInactive,
    isMarkActivePending || isMarkInactivePending,
    pendingId
  );

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
