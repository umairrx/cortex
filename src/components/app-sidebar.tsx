import type * as React from "react";
import blackLogo from "@/assets/black-logo.svg";
import whiteLogo from "@/assets/white-logo.svg";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "@/components/use-theme";
import { navigationItems } from "@/config/navigation";

/**
 * Main application sidebar component that provides navigation and user information.
 * Displays the Cortex DB logo, navigation menu, and user profile section.
 * Adapts logo color based on current theme (light/dark mode).
 *
 * @param user - User data containing name, email, and avatar information
 * @param props - Additional sidebar component properties
 * @returns The application sidebar with navigation and user section
 */
export function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	user?: { name: string; email: string; avatar: string };
}) {
	const { resolvedTheme } = useTheme();
	const defaultUser = {
		name: "User",
		email: "user@example.com",
		avatar: "/avatars/default.jpg",
	};

	const userData = user || defaultUser;

	const logoSrc = resolvedTheme === "dark" ? whiteLogo : blackLogo;

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
							<img
								src={logoSrc}
								alt="Cortex DB Logo"
								className="h-8 w-auto animate-[spin_3s_linear_infinite]"
							/>
							<span className="font-semibold">Cortex DB</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navigationItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
		</Sidebar>
	);
}
