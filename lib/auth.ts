export interface User {
  id: string
  email: string
  role: "admin" | "customer"
}

// Mock admin credentials - for production replace with proper auth
const ADMIN_CREDENTIALS = {
  email: "admin@greenhaven.com",
  password: "admin123",
}

export function authenticateAdmin(email: string, password: string): boolean {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password
}

export function setAuthToken(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", JSON.stringify(user))
  }
}

export function getAuthToken(): User | null {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    return token ? JSON.parse(token) : null
  }
  return null
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

export function isAdmin(): boolean {
  const user = getAuthToken()
  return user?.role === "admin"
}