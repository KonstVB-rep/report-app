export const getFormatFile = (filename: string) => {
  const extIndex = filename.lastIndexOf(".");
  return filename.slice(extIndex);
};
