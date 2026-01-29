export interface UserProfile {
  uid: string
  name: string
  email: string | null
  role: "user" | "admin"
  createdAt: any
}
