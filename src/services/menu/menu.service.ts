import type { MenuItem } from "@/domain/menu/types";
import menuData from "@/data/menu.json";

const MENU = menuData as MenuItem[];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function fetchMenu(): Promise<MenuItem[]> {
  await delay(1000);
  return MENU.map((x) => ({ ...x }));
}
