
import { DropdownItem } from '@/components/UI/DropdownMenu';
import Default from './Default';
import Arrow from './Arrow';
import Buildings from './Buildings';
import Business from './Business';
import Design from './Design';
import Development from './Development';
import Device from './Device';
import Document from './Document';
import Finance from './Finance';
import Food from './Food';
import Logos from './Logos';
import Media from './Media';
import Medical from './Medical';
import Movement from './Movement';
import Others from './Others';
import System from './System';
import User from './User';
import Weather from './Weather';
import { IconName } from '.';

const addGroup = (groupName: string, iconsObj: Record<string, any>, arr: DropdownItem[]) => {
  Object.keys(iconsObj).forEach(icon => {
    arr.push({ id: icon, label: icon, icon: icon as IconName, group: groupName });
  });
};

export const DataIconsGrouped: DropdownItem[] = (() => {
  const groups: DropdownItem[] = [];
  addGroup("Default", Default, groups);
  addGroup("Arrow", Arrow, groups);
  addGroup("Buildings", Buildings, groups);
  addGroup("Business", Business, groups);
  addGroup("Design", Design, groups);
  addGroup("Development", Development, groups);
  addGroup("Device", Device, groups);
  addGroup("Document", Document, groups);
  addGroup("Finance", Finance, groups);
  addGroup("Food", Food, groups);
  addGroup("Logos", Logos, groups);
  addGroup("Media", Media, groups);
  addGroup("Medical", Medical, groups);
  addGroup("Movement", Movement, groups);
  addGroup("Others", Others, groups);
  addGroup("System", System, groups);
  addGroup("User", User, groups);
  addGroup("Weather", Weather, groups);
  return groups;
})();
