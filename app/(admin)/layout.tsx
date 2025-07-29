import type React from "react"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Calendar, Users, Settings, DollarSign, Clock, LogOut, User } from "lucide-react"
import Link from "next/link"
import { headers } from "next/headers" // To pass cookies from client to server API route

const menuItems = [
  {
    title: "Dashboard",
    url: "/", // Relative to /admin
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: Calendar,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Services",
    url: "/services",
    icon: Settings,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: DollarSign,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Clock,
  },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("AdminLayout (Server Component): Rendering...")

  // IMPORTANT: Await the headers() call
  const requestHeaders = await headers()

  let cookieHeader = ""
  try {
    cookieHeader = requestHeaders.get("cookie") || ""
  } catch (e) {
    console.error("AdminLayout (Server Component): Error accessing cookie header:", e)
    redirect("/admin/login")
  }

  console.log("AdminLayout (Server Component): Extracted Cookie Header Value:", cookieHeader)

  // Construct the URL for the API call
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const apiUrl = `${baseUrl}/api/admin/me`

  // Create a Headers object for the fetch request
  const fetchHeaders = new Headers()
  if (cookieHeader) {
    fetchHeaders.set("Cookie", cookieHeader)
  }

  const response = await fetch(apiUrl, {
    headers: fetchHeaders, // Pass the Headers object
    cache: "no-store", // Ensure fresh data
  })

  if (!response.ok) {
    console.log("AdminLayout (Server Component): Failed to fetch admin data (response not OK), redirecting.")
    redirect("/admin/login")
  }

  const admin = await response.json()
  console.log("AdminLayout (Server Component): Admin data fetched successfully for:", admin.email)

  // Client-side logout handler (defined as a nested client component function)
  const handleLogout = async () => {
    "use client" // This function needs to be a client component function

    try {
      await fetch("/api/admin/logout", { method: "POST" })
      window.location.href = "/admin/login" // Force full page reload to clear client state
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-4 py-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Sophia Massage</div>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={`/admin${item.url}`}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback>{admin.name?.charAt(0) || "A"}</AvatarFallback>
                    </Avatar>
                    <span>{admin.name || admin.email}</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  {/* Use a client component for logout */}
                  <LogoutButton onLogout={handleLogout} />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto">
            <div className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium">{admin.name || "Admin"}</span>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Client component for logout button to handle client-side interaction
function LogoutButton({ onLogout }: { onLogout: () => Promise<void> }) {
  return (
    <DropdownMenuItem onClick={onLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Log out
    </DropdownMenuItem>
  )
}
