export const redirectPathCore = (departmentId: number, userId: string): string => {
    switch (departmentId) {
      case 1:
        return `/table/${departmentId}/projects/${userId}`;
      case 2:
        return `/statistics/request-source/${departmentId}/${userId}`;
      default:
        return "/";
    }
  };