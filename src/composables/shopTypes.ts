export interface BaseShopItem {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface HatItem extends BaseShopItem {
  hatID: number;
}

export interface FishItem extends BaseShopItem {
  fishID: number;
}

export interface SpecialItem extends BaseShopItem {
  specialID: number;
}

export interface ShopData {
  hats: HatItem[];
  fish: FishItem[];
  specials: SpecialItem[];
}

export interface ShopUnlocks {
  hats: number[];
  fish: number[];
  specials: number[];
}

export interface EquippedData {
  hats: number[];
  fish: number[];
  specials: number[];
}
