const getFileNameWithoutUuid = (fileName: string) => {
  const pointIndex = fileName.split(".");

  const underlineIndex = fileName.lastIndexOf("_");

  return [fileName.slice(0, underlineIndex),pointIndex[pointIndex.length - 1]].join(".");
};

export default getFileNameWithoutUuid;
