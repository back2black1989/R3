export type ComponentId =
  | 'gift_box_8'
  | 'folding_box_2'
  | 'foil_bag'
  | 'blister_tray'
  | 'dolphin_patch'
  | 'essence_liquid'
  | 'essence_bottle'
  | 'waist_seal'
  | 'exp_card'
  | 'sticker_round';

export interface BOMItem {
  id: ComponentId;
  name: string;
  category: 'packaging' | 'content' | 'accessory';
  defaultMoq: number;
  defaultCost: number;
}

export interface ProductionPlan {
  set8: number; // Quantity of 8-piece sets
  set2: number; // Quantity of 2-piece sets
}

// How many of each component goes into a specific set
export interface BOMRatio {
  [key: string]: number; // ComponentId -> quantity
}

export const COMPONENT_DEFINITIONS: BOMItem[] = [
  { id: 'gift_box_8', name: '8片装-精品礼盒 (含内衬/说明书)', category: 'packaging', defaultMoq: 500, defaultCost: 15.0 },
  { id: 'folding_box_2', name: '2片装-小折盒 (含内衬/说明书)', category: 'packaging', defaultMoq: 1000, defaultCost: 3.5 },
  { id: 'foil_bag', name: '铝箔袋', category: 'packaging', defaultMoq: 10000, defaultCost: 0.5 },
  { id: 'blister_tray', name: '吸塑托盘', category: 'packaging', defaultMoq: 5000, defaultCost: 0.8 },
  { id: 'dolphin_patch', name: '海豚贴 (对)', category: 'content', defaultMoq: 2000, defaultCost: 2.0 },
  { id: 'essence_liquid', name: '精华液 (支/料体)', category: 'content', defaultMoq: 5000, defaultCost: 4.0 },
  { id: 'essence_bottle', name: '精华瓶 (包材)', category: 'packaging', defaultMoq: 5000, defaultCost: 1.2 },
  { id: 'waist_seal', name: '腰封', category: 'accessory', defaultMoq: 1000, defaultCost: 0.3 },
  { id: 'exp_card', name: '小实验卡片', category: 'accessory', defaultMoq: 1000, defaultCost: 0.2 },
  { id: 'sticker_round', name: '哑金圆形贴纸', category: 'accessory', defaultMoq: 5000, defaultCost: 0.1 },
];

export const RATIO_SET_8: BOMRatio = {
  gift_box_8: 1,
  folding_box_2: 0,
  foil_bag: 8,
  blister_tray: 8,
  dolphin_patch: 8,
  essence_liquid: 16,
  essence_bottle: 16,
  waist_seal: 1,
  exp_card: 1,
  sticker_round: 1,
};

export const RATIO_SET_2: BOMRatio = {
  gift_box_8: 0,
  folding_box_2: 1,
  foil_bag: 2,
  blister_tray: 2,
  dolphin_patch: 2,
  essence_liquid: 4,
  essence_bottle: 4,
  waist_seal: 0,
  exp_card: 1,
  sticker_round: 1,
};
