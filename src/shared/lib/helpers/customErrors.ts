export class AuthError extends Error {
  status: number

  constructor(message = "Сессия истекла") {
    super(message)
    this.name = "AuthError"
    this.status = 401
  }
}
