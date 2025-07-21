
"use client";

import * as React from "react";
import Link from "next/link";
import {
  BriefcaseMedical,
  CalendarDays,
  LayoutDashboard,
  UsersRound,
  HeartPulse,
  Globe,
  BrainCircuit,
  DollarSign,
  Package,
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

function LanguageSwitcher() {
  const { locale, setLocale, dictionary } = useLanguage();

  return (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-2 p-2"
          >
            <Globe className="size-8 p-1 text-muted-foreground" />
             <div className="flex flex-col items-start truncate">
                <span className="font-medium">{dictionary.language}</span>
                <span className="text-xs text-muted-foreground">{locale.toUpperCase()}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mb-2 ml-2">
            <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as 'es' | 'en')}>
                <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

function MainSidebar() {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const { dictionary } = useLanguage();
  const isMobile = useIsMobile();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: dictionary.sidebar.dashboard },
    { href: "/patients", icon: UsersRound, label: dictionary.sidebar.patients },
    { href: "/appointments", icon: CalendarDays, label: dictionary.sidebar.appointments },
    { href: "/sales", icon: DollarSign, label: dictionary.sidebar.sales },
    { href: "/services", icon: BriefcaseMedical, label: dictionary.sidebar.services },
    { href: "/packages", icon: Package, label: dictionary.sidebar.packages },
    { href: "/therapists", icon: HeartPulse, label: dictionary.sidebar.therapists },
    { href: "/techniques", icon: BrainCircuit, label: dictionary.sidebar.techniques },
  ];

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
                  isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
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
         <LanguageSwitcher />
         <SidebarSeparator />
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
      </SidebarFooter>
    </Sidebar>
  );
}

export function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="flex flex-col">
        {/* Mobile Header - Always rendered, but hidden on larger screens */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          <SidebarTrigger />
          <div className="flex-1" />
          {/* You can add mobile-specific header items here */}
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Custom hook to detect mobile screen size
// This is a simplified hook. For a more robust solution, you might consider
// using a library or a more complex implementation with cleanup.
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768); // Corresponds to md breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return isMobile;
}
