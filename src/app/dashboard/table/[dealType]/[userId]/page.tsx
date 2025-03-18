import PersonTableProject from "../ui/PersonTableProject";
import PersonTableRetail from "../ui/PersonTableRetails";


const PersonTable = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string }>;
}) => {
  const { dealType } = await params;

  switch (dealType) {
    case "projects":
      return <PersonTableProject />;
    case "retails":
      return <PersonTableRetail />;
    default:
      return null;
  }
};

export default PersonTable;
