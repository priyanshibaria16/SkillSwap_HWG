"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  UserCircle,
  Search,
  CalendarCheck,
  Box, // Using Box for AR Showcase
  Settings2,
  Users, // For Bartering/Bookings
  BadgePercent, // For Gamified profile aspects
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/search", label: "Search Skills", icon: Search },
  { href: "/bookings", label: "My Bookings", icon: Users },
  { href: "/ar-showcase", label: "AR Showcase", icon: Box },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
              tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:flex hidden" }}
              className={cn(
                "justify-start",
                (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden delay-300 duration-300">
                  {item.label}
                </span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
