export const transformObjValueToArr = <T extends Record<string, string>>(
  obj: T
): [string, string][] => Object.entries(obj) as [string, string][];

export const transformObjKeyValueToArr = <T extends Record<string, string>>(
  obj: T
) =>
  Object.entries(obj).map(([key, value]) => ({
    value: key,
    label: value,
  }));
