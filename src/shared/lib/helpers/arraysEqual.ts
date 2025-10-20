export const arraysEqual = (a: string[] | undefined, b: string[] | undefined): boolean => {
  if (a === b) return true // Оба undefined или один и тот же массив
  if (!a || !b) return false // Один из них undefined
  return a.length === b.length && a.every((val, index) => val === b[index])
}
