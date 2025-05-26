"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { IconPlus, IconEye } from "@tabler/icons-react"

export default function PartnerBankLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<string>("create")

  useEffect(() => {
    if (pathname.includes("/view")) {
      setActiveTab("view-details")
    } else if (pathname.includes("/create")) {
      setActiveTab("create")
    } else {
      router.push("/dashboard/partner-bank/create")
    }
  }, [pathname, router])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "create") {
      router.push("/dashboard/partner-bank/create")
    } else if (value === "view-details") {
      router.push("/dashboard/partner-bank/view")
    }
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Partner Banks</h2>
        <p className="text-muted-foreground">
          Manage banking partnerships and integrations
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="create" asChild>
            <Link href="/dashboard/partner-bank/create" className="flex items-center">
              <IconPlus className="mr-2 h-4 w-4" />
              Add Bank
            </Link>
          </TabsTrigger>
          <TabsTrigger value="view-details" asChild>
            <Link href="/dashboard/partner-bank/view" className="flex items-center">
              <IconEye className="mr-2 h-4 w-4" />
              Bank Details
            </Link>
          </TabsTrigger>
        </TabsList>
        
        {children}
      </Tabs>
    </div>
  )
} 