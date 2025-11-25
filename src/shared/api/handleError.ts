export const handleError = (customMessage: string): never => {
  throw new Error(customMessage)
}
