import { useEffect, useState } from "react";

import { checkDepartment } from "@/shared/api/checkByServer";
import {
  pageParamsSchemaDepsId,
  useTypedParams,
} from "@/shared/hooks/useTypedParams";

const ProtectedByDepartmentAffiliation = ({
  children,
}: React.PropsWithChildren) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId);

  useEffect(() => {
    let mounted = true;
    if (!departmentId) return;

    checkDepartment(departmentId).then((result) => setHasAccess(result));

    return () => {
      mounted = false;
    };
  }, [departmentId]);

  return hasAccess ? <>{children}</> : null;
};

export default ProtectedByDepartmentAffiliation;
