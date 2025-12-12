import { IconFileText, IconHome, IconPhoto, IconSettings, IconApi } from "@tabler/icons-react";

/**
 * Navigation items configuration for the main sidebar menu.
 * Each item contains the display title, URL route, and associated icon.
 */
export const navigationItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: IconHome,
  },
  {
    title: "Content Manager",
    url: "/content-manager",
    icon: IconFileText,
  },
  {
    title: "Media Library",
    url: "/media-library",
    icon: IconPhoto,
  },
  {
    title: "Collection Types Builder",
    url: "/collection-types-builder",
    icon: IconSettings,
  },
  {
    title: "API Integration",
    url: "/api-integration",
    icon: IconApi,
  },
];