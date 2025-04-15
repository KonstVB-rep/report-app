export const transformObjValueToArr = <T extends Record<string, string>>(
  obj: T
): [string, string][] => Object.entries(obj) as [string, string][];
