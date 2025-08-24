import dynamic from "next/dynamic";

import DealsSkeleton from "@/entities/deal/ui/DealsSkeleton";

const SummaryDealsTable = dynamic(
  () => import("@/widgets/deal/ui/SummaryDealsTable"),
  {
    loading: () => <DealsSkeleton />,
  }
);

const SummaryTablePage = async () => {
  return <SummaryDealsTable />;
};

export default SummaryTablePage;
