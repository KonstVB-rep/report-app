type FetchOptions = Omit<RequestInit, "signal"> & { timeoutMs?: number }

export class FetchError extends Error {
  response?: Response
  constructor(message: string, response?: Response) {
    super(message)
    this.response = response
  }
}

export const fetchWithTimeout = async (input: string, options: FetchOptions = {}) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!apiBaseUrl) {
    throw new FetchError("API base URL not configured")
  }

  const timeoutMs = options.timeoutMs ?? 10000 // таймаут по умолчанию 10 секунд
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${apiBaseUrl}${input}`, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new FetchError(`Request failed with status ${res.status}`, res)
    }

    return res
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === "AbortError") {
      throw new FetchError("Request timeout")
    }
    throw err
  }
}
