import { IconName } from "@/Icons";

export interface HeaderMenuItem {
  label: string,
  icon: IconName,
  href: string,
}

export const HeaderMenu: HeaderMenuItem[] = [
  { label: 'Главная', icon: 'home', href: '/' },
  { label: 'Профиль', icon: 'user', href: '/profile' },
  { label: 'Cхемы', icon: 'layout_tree', href: '/scheme' },
  { label: 'Воронки', icon: 'filter', href: '/funnel' },
];
export const HeaderMenuAdmin: HeaderMenuItem[] = [
  { label: 'Шаблоны схем', icon: 'default', href: '/admin/schemetemplate' },
];