import { type Icon, IconCirclePlusFilled } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * Main navigation component that displays the primary navigation menu.
 * Includes a "Quick Create" button for quick access to content creation
 * and navigation items with active state indicators.
 *
 * @param items - Array of navigation items with title, URL, and optional icon
 * @returns The main navigation menu component
 */
export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
	}[];
}) {
	const location = useLocation();
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							asChild
							tooltip="Quick Create"
							className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
						>
							<Link to="/content-manager">
								<IconCirclePlusFilled />
								<span>Quick Create</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								isActive={
									location.pathname === item.url ||
									location.pathname.startsWith(`${item.url}/`)
								}
							>
								<Link to={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
