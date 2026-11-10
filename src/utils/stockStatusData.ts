export interface OilStockItem {
  id: string;
  name: string;
  packSize: string;
  palletsPerUnit: number;
  pallets: number;
  cases: number;
  isPlain?: boolean;
  notes?: string;
}

export interface OilCategory {
  id: string;
  title: string;
  items: OilStockItem[];
}

export interface HoneyStockItem {
  id: string;
  srNo: number;
  packDescription: string;
  unitsPerPallet?: number;
  pallets?: number;
  cases: number;
  brand: string;
  expiryDate?: string;
  remarks?: string;
}

export interface HoneyCategory {
  id: string;
  title: string;
  items: HoneyStockItem[];
}

export interface MiscStockItem {
  id: string;
  srNo: number;
  name: string;
  unitType: 'Cases' | 'Bags' | 'Bottles';
  quantity: number;
  subtext?: string;
}

export interface StockStatusData {
  documentTitle: string;
  invoiceCutoff: string;
  asOnDate: string;
  page1Left: OilCategory[];
  page1Right: OilCategory[];
  page2Honey: HoneyCategory[];
  mayonnaise: MiscStockItem[];
  tomatoKetchup: MiscStockItem[];
  akalSupermarketLeft: MiscStockItem[];
  akalSupermarketRight: MiscStockItem[];
  centralFoodMarket: MiscStockItem[];
}

export const INITIAL_STOCK_STATUS_11_10_2026: StockStatusData = {
  documentTitle: 'INVENTORY STATUS',
  invoiceCutoff: 'Up to Invoice #1541',
  asOnDate: '11/10/2026',

  // PAGE 1: LEFT COLUMN
  page1Left: [
    {
      id: 'viola-pomace',
      title: 'VIOLA OLIVE POMANCE OIL',
      items: [
        { id: 'vp-1', name: '1) 1 Ltr x 12', packSize: '1 Ltr x 12', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'vp-2', name: '2) 2 Ltr x 6', packSize: '2 Ltr x 6', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'vp-3', name: '3) 3 Ltr x 4', packSize: '3 Ltr x 4', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'vp-4', name: '4) 3.78 Ltr x 4', packSize: '3.78 Ltr x 4', palletsPerUnit: 70, pallets: 1, cases: 47 },
      ],
    },
    {
      id: 'rajdhani-mustard',
      title: 'RAJDHANI MUSTARD OIL',
      items: [
        { id: 'rm-1', name: '1) 250 ML x 24', packSize: '250 ML x 24', palletsPerUnit: 100, pallets: 2, cases: 94 },
        { id: 'rm-2', name: '2) 500 ML x 12', packSize: '500 ML x 12', palletsPerUnit: 100, pallets: 1, cases: 83 },
        { id: 'rm-2-p', name: 'Plain', packSize: '500 ML x 12', palletsPerUnit: 100, pallets: 4, cases: 20, isPlain: true },
        { id: 'rm-3', name: '3) 1 Ltr x 12', packSize: '1 Ltr x 12', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'rm-3-p', name: 'Plain', packSize: '1 Ltr x 12', palletsPerUnit: 60, pallets: 0, cases: 56, isPlain: true },
        { id: 'rm-4', name: '4) 2 Ltr x 6', packSize: '2 Ltr x 6', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'rm-5', name: '5) 5 Ltr x 4 (PET)', packSize: '5 Ltr x 4 (PET)', palletsPerUnit: 48, pallets: 0, cases: 0 },
      ],
    },
    {
      id: 'parrot-mustard',
      title: 'PARROT - MUSTARD OIL',
      items: [
        { id: 'pm-1', name: '1) 1 Ltr x 12', packSize: '1 Ltr x 12', palletsPerUnit: 60, pallets: 2, cases: 51 },
      ],
    },
    {
      id: 'paras-mustard',
      title: 'PARAS - MUSTARD OIL',
      items: [
        { id: 'pam-1', name: '1) 250 ML x 24', packSize: '250 ML x 24', palletsPerUnit: 100, pallets: 0, cases: 62 },
        { id: 'pam-2', name: '2) 500 ML x 12', packSize: '500 ML x 12', palletsPerUnit: 100, pallets: 0, cases: 78 },
      ],
    },
    {
      id: 'paras-veg',
      title: 'PARAS - VEGETABLE OIL',
      items: [
        { id: 'pv-1', name: '1) 96 Oz x 6', packSize: '96 Oz x 6', palletsPerUnit: 54, pallets: 0, cases: 17 },
      ],
    },
    {
      id: 'paras-sun',
      title: 'PARAS - SUNFLOWER OIL',
      items: [
        { id: 'ps-1', name: '1) 5 Ltr x 4', packSize: '5 Ltr x 4', palletsPerUnit: 48, pallets: 0, cases: 0 },
      ],
    },
    {
      id: 'sunflower-oil',
      title: 'SUNFLOWER OIL',
      items: [
        { id: 'so-1', name: '1) 1 Ltr x 12', packSize: '1 Ltr x 12', palletsPerUnit: 60, pallets: 0, cases: 21 },
        { id: 'so-2', name: '2) 5 Ltr x 4', packSize: '5 Ltr x 4', palletsPerUnit: 48, pallets: 137, cases: 40 },
      ],
    },
    {
      id: 'maizo-corn',
      title: 'MAIZO CORN OIL',
      items: [
        { id: 'mc-1', name: '1 32 Oz X 12', packSize: '32 Oz X 12', palletsPerUnit: 60, pallets: 4, cases: 54 },
        { id: 'mc-1-p', name: 'Plain', packSize: '32 Oz X 12', palletsPerUnit: 60, pallets: 6, cases: 4, isPlain: true },
        { id: 'mc-2', name: '2 40 oz x 12', packSize: '40 oz x 12', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'mc-2-p', name: 'Plain', packSize: '40 oz x 12', palletsPerUnit: 60, pallets: 0, cases: 13, isPlain: true },
        { id: 'mc-3', name: '3 96 Oz x 6', packSize: '96 Oz x 6', palletsPerUnit: 45, pallets: 0, cases: 0 },
        { id: 'mc-3-p', name: 'Plain', packSize: '96 Oz x 6', palletsPerUnit: 45, pallets: 0, cases: 0, isPlain: true },
        { id: 'mc-4', name: '4 128 Oz x 4', packSize: '128 Oz x 4', palletsPerUnit: 48, pallets: 0, cases: 0 },
        { id: 'mc-4-p', name: 'Plain', packSize: '128 Oz x 4', palletsPerUnit: 48, pallets: 0, cases: 32, isPlain: true },
        { id: 'mc-5', name: '5 2-1/2 Gallon x 2', packSize: '2-1/2 Gallon x 2', palletsPerUnit: 45, pallets: 0, cases: 28 },
      ],
    },
  ],

  // PAGE 1: RIGHT COLUMN
  page1Right: [
    {
      id: 'xlfry-veg',
      title: 'XLFRY VEGETABLE',
      items: [
        { id: 'xl-1', name: '1) 32 Oz X 12', packSize: '32 Oz X 12', palletsPerUnit: 60, pallets: 0, cases: 42 },
        { id: 'xl-1-p', name: 'Plain', packSize: '32 Oz X 12', palletsPerUnit: 60, pallets: 0, cases: 0, isPlain: true },
        { id: 'xl-2', name: '2) 40 oz x 12', packSize: '40 oz x 12', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'xl-2-p', name: 'Plain', packSize: '40 oz x 12', palletsPerUnit: 60, pallets: 3, cases: 57, isPlain: true },
        { id: 'xl-3', name: '3) 96 Oz x 6', packSize: '96 Oz x 6', palletsPerUnit: 45, pallets: 0, cases: 4 },
        { id: 'xl-3-p', name: 'Plain', packSize: '96 Oz x 6', palletsPerUnit: 45, pallets: 0, cases: 37, isPlain: true },
        { id: 'xl-4', name: '4) 128 Oz x 4', packSize: '128 Oz x 4', palletsPerUnit: 48, pallets: 2, cases: 25 },
        { id: 'xl-4-p', name: 'Plain', packSize: '128 Oz x 4', palletsPerUnit: 48, pallets: 1, cases: 4, isPlain: true },
      ],
    },
    {
      id: 'canola-oil',
      title: 'CANOLA OIL',
      items: [
        { id: 'co-1', name: '1) 32 Oz X 12', packSize: '32 Oz X 12', palletsPerUnit: 60, pallets: 0, cases: 3 },
        { id: 'co-1-p', name: 'Plain', packSize: '32 Oz X 12', palletsPerUnit: 60, pallets: 1, cases: 1, isPlain: true },
        { id: 'co-2', name: '2) 40 oz x 12', packSize: '40 oz x 12', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'co-2-p', name: 'Plain', packSize: '40 oz x 12', palletsPerUnit: 60, pallets: 0, cases: 0, isPlain: true },
        { id: 'co-3', name: '3) 96 Oz x 6', packSize: '96 Oz x 6', palletsPerUnit: 45, pallets: 0, cases: 0 },
        { id: 'co-3-p', name: 'Plain', packSize: '96 Oz x 6', palletsPerUnit: 45, pallets: 0, cases: 27, isPlain: true },
        { id: 'co-4', name: '4) 128 Oz x 4', packSize: '128 Oz x 4', palletsPerUnit: 48, pallets: 0, cases: 0 },
        { id: 'co-4-p', name: 'Plain', packSize: '128 Oz x 4', palletsPerUnit: 48, pallets: 0, cases: 0, isPlain: true },
      ],
    },
    {
      id: 'bulk-32-5-lbs',
      title: '32.5 LBS (POUNDS)',
      items: [
        { id: 'b32-1', name: '1) VEGETABLE OIL', packSize: '32.5 Lbs', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'b32-2', name: '2) SOYABEAN OIL', packSize: '32.5 Lbs', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'b32-3', name: '3) CANOLA OIL', packSize: '32.5 Lbs', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'b32-4', name: '4) Avocado Oil', packSize: '32.5 Lbs', palletsPerUnit: 60, pallets: 0, cases: 0 },
      ],
    },
    {
      id: 'bulk-35-lbs',
      title: '35 LBS (POUNDS)',
      items: [
        { id: 'b35-1', name: '1) VEGETABLE OIL', packSize: '35 Lbs', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'b35-2', name: '2) SOYABEAN OIL', packSize: '35 Lbs', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'b35-3', name: '3) CANOLA OIL', packSize: '35 Lbs', palletsPerUnit: 60, pallets: 0, cases: 0 },
      ],
    },
    {
      id: 'aapki-pasand-return',
      title: 'AAPKI PASAND MUSTARD OIL - RETURN',
      items: [
        { id: 'apr-1', name: '1) 1 Ltr x 12 (PET)', packSize: '1 Ltr x 12 (PET)', palletsPerUnit: 60, pallets: 0, cases: 0 },
        { id: 'apr-2', name: '2) 5 Ltr x 4 (PET)', packSize: '5 Ltr x 4 (PET)', palletsPerUnit: 48, pallets: 2, cases: 16 },
        { id: 'apr-3', name: '3) 5 Ltr x 2 (PET)', packSize: '5 Ltr x 2 (PET)', palletsPerUnit: 60, pallets: 1, cases: 50 },
      ],
    },
    {
      id: 'ashoka-peanut-return',
      title: 'ASHOKA BRAND PEANUT OIL - RETURN',
      items: [
        { id: 'ash-1', name: '1) 2 Ltr x 6 (PET)', packSize: '2 Ltr x 6 (PET)', palletsPerUnit: 60, pallets: 4, cases: 15 },
        { id: 'ash-2', name: '2) 5 Ltr x 4 (PET)', packSize: '5 Ltr x 4 (PET)', palletsPerUnit: 48, pallets: 0, cases: 20 },
      ],
    },
  ],

  // PAGE 2: HONEY INVENTORY
  page2Honey: [
    {
      id: 'h-340',
      title: 'HONEY 340 GM X 12',
      items: [
        { id: 'h340-1', srNo: 1, packDescription: 'TEDDY BEAR PET BOTTLE', unitsPerPallet: 216, pallets: 4, cases: 65, brand: 'AL SIHA', expiryDate: '07/2026' },
        { id: 'h340-2', srNo: 2, packDescription: 'TEDDY BEAR PET BOTTLE', unitsPerPallet: 216, pallets: 0, cases: 39, brand: 'AL SIHA', remarks: 'Return Item' },
      ],
    },
    {
      id: 'h-400',
      title: 'HONEY 400 GM X 12',
      items: [
        { id: 'h400-1', srNo: 1, packDescription: 'REVERSE PET SQUEEZE', unitsPerPallet: 250, pallets: 1, cases: 112, brand: 'AL SIHA', remarks: '2nd Lot' },
      ],
    },
    {
      id: 'h-16oz',
      title: 'HONEY 16 OZ X 12',
      items: [
        { id: 'h16-1', srNo: 1, packDescription: 'BEEHIVE GLASS BOTTLE', cases: 150, brand: "Heaven's", expiryDate: '04/2029' },
        { id: 'h16-2', srNo: 2, packDescription: 'BEEHIVE GLASS BOTTLE', cases: 301, brand: "Heaven's", expiryDate: '06/2029' },
      ],
    },
    {
      id: 'h-500',
      title: 'HONEY 500 GM X 12',
      items: [
        { id: 'h500-1', srNo: 1, packDescription: 'BEEHIVE PET BOTTLE', unitsPerPallet: 159, pallets: 0, cases: 25, brand: 'AL SIHA', remarks: '2nd Lot' },
        { id: 'h500-2', srNo: 2, packDescription: 'DOME SQUEEZE BOTTLE', unitsPerPallet: 100, pallets: 0, cases: 34, brand: 'AL SIHA', remarks: '2nd Lot' },
        { id: 'h500-3', srNo: 3, packDescription: 'ROUND COMB PET BOTTLE', unitsPerPallet: 76, pallets: 1, cases: 0, brand: 'AL SIHA', expiryDate: '07/2026' },
        { id: 'h500-4', srNo: 4, packDescription: 'ROUND COMB PET BOTTLE', cases: 158, brand: 'AL SIHA', remarks: 'Return Item' },
        { id: 'h500-5', srNo: 5, packDescription: 'ROUND COMB PET BOTTLE', cases: 446, brand: "Heaven's", expiryDate: '03/2029' },
        { id: 'h500-6', srNo: 6, packDescription: 'SQUARE GLASS BOTTLE', unitsPerPallet: 150, pallets: 0, cases: 80, brand: 'AL SIHA', expiryDate: '07/2026' },
        { id: 'h500-7', srNo: 7, packDescription: 'ROUND OCT GLASS JAR', unitsPerPallet: 176, pallets: 3, cases: 12, brand: 'AL SIHA', remarks: '2nd Lot' },
      ],
    },
    {
      id: 'h-680',
      title: 'HONEY 680 GM X 12',
      items: [
        { id: 'h680-1', srNo: 1, packDescription: 'BEEHIVE PET BOTTLE', unitsPerPallet: 144, pallets: 2, cases: 0, brand: 'AL SIHA', expiryDate: '08/2027' },
      ],
    },
    {
      id: 'h-32oz',
      title: 'HONEY 32 OZ X 12',
      items: [
        { id: 'h32-1', srNo: 1, packDescription: 'BEEHIVE GLASS BOTTLE', cases: 31, brand: "Heaven's", expiryDate: '04/2029' },
      ],
    },
    {
      id: 'h-1kg-6',
      title: 'HONEY 1 KG X 6',
      items: [
        { id: 'h1k6-1', srNo: 1, packDescription: 'SQUARE GLASS BOTTLE', unitsPerPallet: 156, pallets: 0, cases: 60, brand: 'AL SIHA', expiryDate: '07/2026' },
        { id: 'h1k6-2', srNo: 2, packDescription: 'SQUARE GLASS BOTTLE', unitsPerPallet: 156, pallets: 0, cases: 35, brand: 'AL SIHA', remarks: 'Return Item' },
        { id: 'h1k6-3', srNo: 3, packDescription: 'ROUND COMB PET', unitsPerPallet: 116, pallets: 1, cases: 0, brand: 'AL SIHA', expiryDate: '07/2026' },
        { id: 'h1k6-4', srNo: 4, packDescription: 'ROUND COMB PET', unitsPerPallet: 116, pallets: 0, cases: 34, brand: 'AL SIHA', remarks: 'Return Item' },
      ],
    },
    {
      id: 'h-1kg-12',
      title: 'HONEY 1 KG X 12',
      items: [
        { id: 'h1k12-1', srNo: 1, packDescription: 'ROUND COMB IN PET BOTTLE', cases: 192, brand: "Heaven's", expiryDate: '03/2029' },
        { id: 'h1k12-2', srNo: 2, packDescription: 'ROUND COMB IN PET BOTTLE', cases: 510, brand: "Heaven's", expiryDate: '06/2029' },
      ],
    },
    {
      id: 'h-2kg',
      title: 'HONEY 2 KG X 6',
      items: [
        { id: 'h2k-1', srNo: 1, packDescription: 'ROUND JERRY CAN', cases: 125, brand: "Heaven's", expiryDate: '03/2029' },
      ],
    },
    {
      id: 'h-80oz',
      title: 'HONEY 80 OZ X 6',
      items: [
        { id: 'h80-1', srNo: 1, packDescription: 'CLOVER HONEY IN PET BOTTLE', cases: 5, brand: "Heaven's", expiryDate: '03/2029' },
      ],
    },
    {
      id: 'h-15kg',
      title: 'HONEY 15 KG X 1',
      items: [
        { id: 'h15k-1', srNo: 1, packDescription: 'HONEY IN BUCKET', cases: 499, brand: 'AAPKI PASAND', remarks: 'Return Item' },
      ],
    },
  ],

  // PAGE 3: MAYONNAISE, TOMATO KETCHUP & OTHER STOCK
  mayonnaise: [
    {
      id: 'mayo-1',
      srNo: 1,
      name: 'VITAL MAYONNAISE GALLON 3.78 LTR',
      subtext: '(3.78 LTR X 4 PCS PER CARTON)',
      unitType: 'Cases',
      quantity: 34,
    },
  ],

  tomatoKetchup: [
    {
      id: 'ketchup-1',
      srNo: 1,
      name: 'VITAL - TOMATO KETCHUP 5 KG',
      subtext: '(5 KG X 4 PCS PER CARTON)',
      unitType: 'Cases',
      quantity: 89,
    },
  ],

  akalSupermarketLeft: [
    { id: 'akal-1', srNo: 1, name: 'Mansa Premium Everyday - 10 LBS', unitType: 'Bags', quantity: 38 },
    { id: 'akal-2', srNo: 2, name: 'Mansa Premium Basmati Rice - 10 LBS', unitType: 'Bags', quantity: 1 },
    { id: 'akal-3', srNo: 3, name: 'Premass Basmati Rice - 20 LBS', unitType: 'Bags', quantity: 9 },
    { id: 'akal-4', srNo: 4, name: 'Godavari Sona Masoori Rice - 20 LBS', unitType: 'Bags', quantity: 6 },
    { id: 'akal-5', srNo: 5, name: 'Just Organic Sona Masoori - 20 LBS', unitType: 'Bags', quantity: 9 },
    { id: 'akal-6', srNo: 6, name: 'Mansa Premium Basmati - 20 LBS', unitType: 'Bags', quantity: 26 },
    { id: 'akal-7', srNo: 7, name: 'Global Basmati Rice - 20 LBS', unitType: 'Bags', quantity: 12 },
    { id: 'akal-8', srNo: 8, name: 'Mansa Premium Basmati Rice - 40 LBS', unitType: 'Bags', quantity: 2 },
  ],

  akalSupermarketRight: [
    { id: 'akal-r1', srNo: 1, name: 'Pure Canola OIl - 1 Gallon Bottle', unitType: 'Bottles', quantity: 1 },
    { id: 'akal-r2', srNo: 2, name: 'Wessbn Corn Oil - 1 Gallon Bottle', unitType: 'Bottles', quantity: 22 },
    { id: 'akal-r3', srNo: 3, name: 'Vegetable Plus Oil - 1 Gallon Bottle', unitType: 'Bottles', quantity: 6 },
    { id: 'akal-r4', srNo: 4, name: 'Vegetable Plus Oil - 2.84 Ltr Bottle', unitType: 'Bottles', quantity: 6 },
    { id: 'akal-r5', srNo: 5, name: 'Sesame Oil - 5 LBS Bottle', unitType: 'Bottles', quantity: 4 },
    { id: 'akal-r6', srNo: 6, name: 'Sunflower Green Label 3 Ltr Bottle', unitType: 'Bottles', quantity: 18 },
    { id: 'akal-r7', srNo: 7, name: 'Peanut Oil - 2 LBS Bottle', unitType: 'Bottles', quantity: 4 },
    { id: 'akal-r8', srNo: 8, name: 'Vegetable Oil - Mixed - 35 LBS', unitType: 'Cases', quantity: 10 },
  ],

  centralFoodMarket: [
    { id: 'cfm-1', srNo: 1, name: 'Sunflower Oil - 10 LTR Bottle', unitType: 'Bottles', quantity: 7 },
    { id: 'cfm-2', srNo: 2, name: 'Sunflower Oil - 3 LTR Bottle', unitType: 'Bottles', quantity: 17 },
    { id: 'cfm-3', srNo: 3, name: 'Sunflower Oil - 2 LTR Bottle', unitType: 'Bottles', quantity: 24 },
  ],
};
