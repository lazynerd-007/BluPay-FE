"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconHome, 
  IconCreditCard, 
  IconWallet,
  IconSettings,
  IconChartBar,
  IconReceipt,
  IconDeviceMobile,
  IconBuildingStore,
  IconUser,
  IconCode
} from "@tabler/icons-react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function SidebarItem({ href, icon, label, isActive }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        }`}
      >
        <div className="w-5 h-5">{icon}</div>
        <span>{label}</span>
      </div>
    </Link>
  );
}

export default function MerchantDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const sidebarItems = [
    {
      href: "/merchant/dashboard",
      icon: <IconHome className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/merchant/dashboard/transactions",
      icon: <IconReceipt className="w-5 h-5" />,
      label: "Transactions",
    },
    {
      href: "/merchant/dashboard/payments",
      icon: <IconCreditCard className="w-5 h-5" />,
      label: "Payments",
    },
    {
      href: "/merchant/dashboard/wallet",
      icon: <IconWallet className="w-5 h-5" />,
      label: "Wallet",
    },
    {
      href: "/merchant/dashboard/terminals",
      icon: <IconDeviceMobile className="w-5 h-5" />,
      label: "Terminals",
    },
    {
      href: "/merchant/dashboard/developer",
      icon: <IconCode className="w-5 h-5" />,
      label: "Developer",
    },
    {
      href: "/merchant/dashboard/profile",
      icon: <IconUser className="w-5 h-5" />,
      label: "Profile",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4">
        <div className="flex items-center space-x-2 mb-6 px-3">
          <div className="h-8 w-8 rounded-full bg-primary"></div>
          <span className="text-xl font-bold">BluPay Merchant</span>
        </div>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
} 