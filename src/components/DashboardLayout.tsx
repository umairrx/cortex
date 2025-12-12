import { type ReactNode } from "react";
import { useUserData } from "../hooks/useUserData";
import { AppSidebar } from "@/components/app-sidebar";
import FontSelector from "@/components/FontSelector";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const userData = useUserData();

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>
        <SidebarHeader>
          <div className="flex w-full justify-between items-center">
            <SidebarTrigger />
            <div className="flex gap-3">
              <FontSelector />
              <ModeToggle />
            </div>
          </div>
        </SidebarHeader>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
