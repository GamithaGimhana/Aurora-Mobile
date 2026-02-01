export interface UserProfile {
  uid: string
  name: string
  email: string | null
  role: "USER" | "ADMIN"
  createdAt: string
  updatedAt?: string
}
