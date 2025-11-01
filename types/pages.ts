import { IconName } from "@/Icons";

export interface HeaderMenuItem {
    id: string;
    label: string;
    icon: IconName;
    href: string;
    adminOnly?: boolean;
    isDivider?: boolean;
    dividerLabel?: string;
}

export interface PageData {
    title: string;
    description: string;
}