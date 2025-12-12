import { IconFileText, IconHome, IconPhoto, IconSettings, IconApi } from "@tabler/icons-react";

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
    title: "Content Type Builder",
    url: "/content-type-builder",
    icon: IconSettings,
  },
  {
    title: "API Integration",
    url: "/api-integration",
    icon: IconApi,
  },
];