import { redirect } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  redirect("/login/merchant")
  return null
}
