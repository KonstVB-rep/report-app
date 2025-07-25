import dynamic from "next/dynamic";

const SummaryTableProject = dynamic(() => import("../ui/SummaryTableProject"));
const SummaryTableRetail = dynamic(() => import("../ui/SummaryTableRetail"));

const SummaryTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; departmentId: string; userId: string }>;
}) => {
  const { dealType } = await params;

  switch (dealType) {
    case "projects":
      return <SummaryTableProject />;
    case "retails":
      return <SummaryTableRetail />;
    default:
      return null;
  }
};

export default SummaryTablePage;
