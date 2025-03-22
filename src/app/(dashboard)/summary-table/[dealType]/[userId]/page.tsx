

import SummaryTableProject from "../ui/SummaryTableProject";
import SummaryTableRetail from "../ui/SummaryTableRetail";

const PersonTable = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string }>;
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

export default PersonTable;
