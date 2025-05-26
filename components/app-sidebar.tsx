"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconCreditCard,
  IconUsers,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconBuildingStore,
  IconTransfer,
  IconAlertCircle,
  IconHome,
  IconUserCircle,
  IconReportMoney,
  IconDeviceAnalytics,
  IconBuildingBank,
  IconDeviceMobile,
  IconFileAnalytics,
  IconServer,
  IconChartPie,
  IconBell,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/lib/store"

// Admin navigation data
const adminData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Merchants",
      url: "/dashboard/merchant",
      icon: IconBuildingStore,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconTransfer,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartPie,
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Partner Banks",
      url: "/dashboard/partner-bank",
      icon: IconBuildingBank,
    },
    {
      title: "OVA",
      url: "/dashboard/ova",
      icon: IconCreditCard,
    },
    {
      title: "Financial Reports",
      url: "/dashboard/financial-reports",
      icon: IconFileAnalytics,
    },
    {
      title: "Commissions",
      url: "/dashboard/commissions",
      icon: IconReportMoney,
    },
    {
      title: "Terminal Device Management",
      url: "/dashboard/terminal-device-management",
      icon: IconDeviceMobile,
    },
    {
      title: "System Logs",
      url: "/dashboard/system-logs",
      icon: IconDatabase,
    },
    {
      title: "System Status",
      url: "/dashboard/system-status",
      icon: IconServer,
    },
  ],
  navSecondary: [
    {
      title: "Account",
      url: "/dashboard/account",
      icon: IconUserCircle,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconBell,
    },
    {
      title: "Help Center",
      url: "/dashboard/help-center",
      icon: IconHelp,
    },
  ],
}

// Merchant navigation data
const merchantData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconTransfer,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartPie,
    },
    {
      title: "Payments",
      url: "#",
      icon: IconCreditCard,
    },
    {
      title: "Customers",
      url: "#",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Account",
      url: "/dashboard/account",
      icon: IconUserCircle,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconBell,
    },
    {
      title: "Support",
      url: "#",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuthStore();
  
  // Determine which navigation data to use based on user role
  const data = user?.role === "admin" ? adminData : merchantData;
  
  // User data
  const userData = {
    name: user?.name || user?.email?.split('@')[0] || "User",
    email: user?.email || "user@example.com",
    avatar: "/avatars/user.jpg",
  };
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">BluPay</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={userData} 
          onSignOut={() => logout()} 
        />
      </SidebarFooter>
    </Sidebar>
  )
}
