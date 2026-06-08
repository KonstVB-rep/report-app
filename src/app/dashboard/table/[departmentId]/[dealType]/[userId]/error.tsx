"use client"

import ErrorTemplate from "@/shared/components/error-template"

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorTemplate error={error} reset={reset} />
}
