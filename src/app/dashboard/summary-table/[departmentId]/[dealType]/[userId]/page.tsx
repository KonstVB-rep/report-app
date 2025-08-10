import dynamic from "next/dynamic";

import DealsSkeleton from "@/entities/deal/ui/DealsSkeleton";

const SummaryTable = dynamic(() => import("../ui/SummaryTable"), {
  loading: () => <DealsSkeleton />,
});

const SummaryTablePage = async () => {
  return <SummaryTable />;
};

export default SummaryTablePage;
