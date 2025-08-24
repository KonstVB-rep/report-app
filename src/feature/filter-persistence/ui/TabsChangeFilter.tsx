import React from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { useGetUserFilterById } from "../hooks/query";
import DelSavedFilterForm from "./DelSavedFilterForm";
import UpdateSavedFilterForm from "./UpdateSavedFilterForm";

const TabsChangeFilter = ({ filterId }: { filterId: string }) => {
  const { data: filter, isPending } = useGetUserFilterById(filterId);

  if (isPending) {
    return <FilterSleketonLoader />;
  }

  if (!filter) {
    return null;
  }

  return (
    <Tabs
      defaultValue="update"
      className="w-full min-w-[300px] md:min-w-[400px]"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="update">Обновить</TabsTrigger>
        <TabsTrigger value="delete">Удалить</TabsTrigger>
      </TabsList>
      <TabsContent value="delete">
        <DelSavedFilterForm
          filterName={filter.filterName}
          filterId={filter.id}
        />
      </TabsContent>
      <TabsContent value="update">
        <UpdateSavedFilterForm filter={filter} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsChangeFilter;

const FilterSleketonLoader = () => {
  return (
    <div className="grid w-full min-w-[300px] gap-2 md:min-w-[400px]">
      <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-background p-4">
        <div className="h-10 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-10 animate-pulse rounded-xl bg-muted/50" />
      </div>
      <div className="h-52 w-full animate-pulse rounded-xl bg-muted/50" />
    </div>
  );
};
