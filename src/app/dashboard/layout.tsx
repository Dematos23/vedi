
"use client";

import Link from "next/link";
import {
  BriefcaseMedical,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  UsersRound,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/patients", icon: UsersRound, label: "Patients" },
  { href: "/dashboard/services", icon: BriefcaseMedical, label: "Services" },
  { href: "/dashboard/appointments", icon: CalendarDays, label: "Appointments" },
];

function MainSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpen } = useSidebar();

  const handleLinkClick = () => {
    if(isMobile) {
      setOpen(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
                  onClick={handleLinkClick}
                >
                  <item.icon />
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto w-full justify-start gap-2 p-2"
              >
                <Avatar className="size-8">
                  <AvatarImage
                    src="https://placehold.co/32x32.png"
                    alt="@therapist"
                    data-ai-hint="person user"
                  />
                  <AvatarFallback>TH</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start truncate">
                    <span className="font-medium">The Therapist</span>
                    <span className="text-xs text-muted-foreground">the.therapist@vedi.com</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mb-2 ml-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        <SidebarMenu>
          <SidebarMenuItem>
             <Link href="/login">
              <SidebarMenuButton>
                <LogOut />
                Logout
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
