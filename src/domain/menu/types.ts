export type MenuCategory = "sandwich" | "extra";

export type MenuItemId = "burger" | "egg" | "bacon" | "fries" | "soft_drink";

export interface MenuItem {
  id: MenuItemId;
  name: string;
  category: MenuCategory;
  price: number;
}
