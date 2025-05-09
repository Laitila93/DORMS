import type { Socket } from 'socket.io-client';
import {
  shopData,
  shopUnlocks,
  equippedData,
  dormID,
} from './shopState';
import type { ShopData, ShopUnlocks, EquippedData } from './shopTypes';

export function useShopData(socket: Socket) {

    dormID.value = sessionStorage.getItem('dormID');
    const cachedShopData = sessionStorage.getItem('shopData');
    const cachedUnlocks = sessionStorage.getItem('shopUnlocks');
    const cachedEquippedData = sessionStorage.getItem('equippedData');

    if (cachedShopData) {
      shopData.value = JSON.parse(cachedShopData);
    } else {
      socket.emit('getShopData', 'en');
    }

    if (cachedUnlocks) {
      shopUnlocks.value = JSON.parse(cachedUnlocks);
    } else {
      socket.emit('getUnlocks', dormID.value);
    }

    if (cachedEquippedData) {
      equippedData.value = JSON.parse(cachedEquippedData);
    } else {
      socket.emit('getEquipped', dormID.value);
    }

    socket.off('shopData').on('shopData', (data) => {
      const normalized: ShopData = {
        fish: data.fishes,
        hats: data.hats,
        specials: data.specials,
      };
      shopData.value = normalized;
      sessionStorage.setItem('shopData', JSON.stringify(normalized));
    });

    socket.off('shopUnlocks').on('shopUnlocks', (data) => {
      const normalized: ShopUnlocks = {
        fish: data.fishes.map((f: any) => f.fishID),
        hats: data.hats.map((h: any) => h.hatID),
        specials: data.specials.map((s: any) => s.specialID),
      };
      shopUnlocks.value = normalized;
      sessionStorage.setItem('shopUnlocks', JSON.stringify(normalized));
    });

    socket.off('equippedData').on('equippedData', (data) => {
      const normalized: EquippedData = {
        fish: data.fishes.map((f: any) => f.fishID),
        hats: data.hats.map((h: any) => h.hatID),
        specials: data.specials.map((s: any) => s.specialID),
      };
      equippedData.value = normalized;
      sessionStorage.setItem('equippedData', JSON.stringify(normalized));
    });

  return {
    shopData,
    shopUnlocks,
    equippedData,
    dormID,
  };
}
