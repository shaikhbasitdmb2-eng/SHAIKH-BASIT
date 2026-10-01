import rawWheelHeroImg from '../assets/images/spoked_moto_wheel_cutout_1790603311526.jpg';
import rawFastMovingImg from '../assets/images/mono_fast_moving_parts_1790597426715.jpg';
import rawEngineElectricalImg from '../assets/images/mono_part_by_category_1790597439270.jpg';
import rawBikeModelImg from '../assets/images/mono_shop_by_bike_1790597450604.jpg';
import rawSpecialDealsImg from '../assets/images/mono_special_deals_1790597461035.jpg';

const wpAssetBase =
  typeof window !== 'undefined' &&
  (window as unknown as { __COILCUBE_ASSET_BASE__?: string }).__COILCUBE_ASSET_BASE__
    ? (window as unknown as { __COILCUBE_ASSET_BASE__: string }).__COILCUBE_ASSET_BASE__.replace(
        /\/$/,
        ''
      )
    : '';

const wheelHeroImg = wpAssetBase
  ? `${wpAssetBase}/spoked_moto_wheel_cutout.jpg`
  : rawWheelHeroImg;
const fastMovingImg = wpAssetBase
  ? `${wpAssetBase}/mono_fast_moving_parts.jpg`
  : rawFastMovingImg;
const engineElectricalImg = wpAssetBase
  ? `${wpAssetBase}/mono_part_by_category.jpg`
  : rawEngineElectricalImg;
const bikeModelImg = wpAssetBase
  ? `${wpAssetBase}/mono_shop_by_bike.jpg`
  : rawBikeModelImg;
const specialDealsImg = wpAssetBase
  ? `${wpAssetBase}/mono_special_deals.jpg`
  : rawSpecialDealsImg;

export {
  wheelHeroImg,
  fastMovingImg,
  engineElectricalImg,
  bikeModelImg,
  specialDealsImg,
};

export type GallerySectionId =
  | 'fast-moving'
  | 'by-category'
  | 'bike-model'
  | 'special-deals';

export type PartCategory =
  | 'Fast Moving'
  | 'Engine Parts'
  | 'Body Panels'
  | 'Electricals'
  | 'Accessories'
  | 'Combo Packs';

export type BikeModelName =
  | 'All Models'
  | 'Hero Splendor+'
  | 'Bajaj Pulsar'
  | 'TVS Apache'
  | 'Honda Activa'
  | 'Honda CG125 / CD70'
  | 'Royal Enfield';

export interface GalleryQuadrant {
  id: GallerySectionId;
  gridPosition: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlights: string[];
  badge: string;
}

export interface SparePartProduct {
  id: string;
  sku: string;
  name: string;
  galleryId: GallerySectionId;
  category: PartCategory;
  compatibleBikes: BikeModelName[];
  originalPrice: number;
  price: number;
  discountPercent: number;
  isOnSale: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  image: string;
  shortDesc: string;
  specs: {
    label: string;
    value: string;
  }[];
  warranty: string;
}

export const BIKE_MODELS: {
  id: BikeModelName;
  label: string;
  brand: string;
  cc: string;
}[] = [
  { id: 'All Models', label: 'All Models / Universal', brand: 'Multi-Brand OEM', cc: '70cc - 500cc' },
  { id: 'Hero Splendor+', label: 'Hero Splendor+ / HF Deluxe', brand: 'Hero MotoCorp', cc: '97.2cc' },
  { id: 'Bajaj Pulsar', label: 'Bajaj Pulsar 150 / 180 / 220F', brand: 'Bajaj Auto', cc: '150cc - 220cc' },
  { id: 'TVS Apache', label: 'TVS Apache RTR 160 / 200 4V', brand: 'TVS Motor', cc: '160cc - 200cc' },
  { id: 'Honda Activa', label: 'Honda Activa 5G / 6G / 125', brand: 'Honda', cc: '110cc - 125cc' },
  { id: 'Honda CG125 / CD70', label: 'Honda CG125 / CD70 / YBR125', brand: 'Atlas / Yamaha', cc: '70cc - 125cc' },
  { id: 'Royal Enfield', label: 'Royal Enfield Classic / Bullet 350', brand: 'Royal Enfield', cc: '349cc' },
];

export const PART_CATEGORIES: {
  id: PartCategory;
  label: string;
  countLabel: string;
}[] = [
  { id: 'Fast Moving', label: 'Fast Moving Parts', countLabel: 'Oils, Brake Pads, Filters' },
  { id: 'Engine Parts', label: 'Engine Parts', countLabel: 'Pistons, Clutch, Valves' },
  { id: 'Body Panels', label: 'Body Panels', countLabel: 'Mudguards, Visors, Shrouds' },
  { id: 'Electricals', label: 'Electricals', countLabel: 'Stator Coils, LED, Plugs' },
  { id: 'Accessories', label: 'Accessories', countLabel: 'CNC Levers, Mirrors, Guards' },
  { id: 'Combo Packs', label: 'Combo-Offers!', countLabel: 'Complete Service Kits' },
];

export type PaymentMethodCode =
  | 'MOBILE_WALLET'
  | 'CARD'
  | 'DIGITAL_WALLET'
  | 'IBFT'
  | 'COD'
  | 'UPI';

export interface PaymentMethodInfo {
  id: 'MOBILE_WALLET' | 'CARD' | 'DIGITAL_WALLET' | 'IBFT';
  code: string;
  title: string;
  providers: string[];
  description: string;
  shortLabel: string;
}

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'MOBILE_WALLET',
    code: 'PAY-01',
    title: 'Mobile Wallets (JazzCash aur EasyPaisa)',
    shortLabel: 'JazzCash / EasyPaisa',
    providers: ['JazzCash', 'EasyPaisa'],
    description:
      'Direct wallet balance, QR code, ya mobile number ke zariye sab se aasan aur tez payment.',
  },
  {
    id: 'CARD',
    code: 'PAY-02',
    title: 'Credit / Debit Cards (Visa, Mastercard, PayPak)',
    shortLabel: 'Visa / Mastercard / PayPak',
    providers: ['Visa', 'Mastercard', 'PayPak'],
    description: 'Local aur international online card payments ke liye.',
  },
  {
    id: 'DIGITAL_WALLET',
    code: 'PAY-03',
    title: 'Digital Banking Wallets (SadaPay aur NayaPay)',
    shortLabel: 'SadaPay / NayaPay',
    providers: ['SadaPay', 'NayaPay'],
    description: 'Naujawanon mein maqbool fintech card aur app options.',
  },
  {
    id: 'IBFT',
    code: 'PAY-04',
    title: 'Net Banking (IBFT)',
    shortLabel: 'Net Banking (IBFT)',
    providers: ['HBL', 'Meezan Bank', 'UBL', 'Bank Alfalah', 'MCB', 'Allied Bank'],
    description: 'Direct bank transfer ke zariye ba-asani payment.',
  },
];

export const GALLERY_QUADRANTS: GalleryQuadrant[] = [
  {
    id: 'fast-moving',
    gridPosition: 'COLLECTION 01',
    code: 'GAL-FM-01',
    title: 'Fast Moving Part',
    subtitle: 'Engine oil, brake pads, chain-sprocket, filters',
    description:
      'High-demand daily maintenance consumables — full-synthetic 4T engine oils, ceramic disc brake pads, heavy-duty chain-sprocket sets, and pleated air & oil filters.',
    image: fastMovingImg,
    highlights: ['Engine Oil 4T 10W-40', 'Ceramic Brake Pads', 'Chain-Sprocket & Filters'],
    badge: 'BEST SELLERS',
  },
  {
    id: 'by-category',
    gridPosition: 'COLLECTION 02',
    code: 'GAL-CAT-02',
    title: 'Part by Category',
    subtitle: 'Engine parts, body panels, electricals, suspension',
    description:
      'Organized departments covering forged internal engine components, factory-finish ABS body panels, copper stator ignition coils, and suspension assemblies.',
    image: engineElectricalImg,
    highlights: ['Engine Parts', 'Body Panels', 'Electricals & Suspension'],
    badge: '4 DEPARTMENTS',
  },
  {
    id: 'bike-model',
    gridPosition: 'COLLECTION 03',
    code: 'GAL-MOD-03',
    title: 'Shop by Bike Model',
    subtitle: 'Splendor, Pulsar, Apache, Activa, etc.',
    description:
      'Filter spare parts by your exact motorcycle model for guaranteed bolt-on chassis compatibility and factory specification clearances.',
    image: bikeModelImg,
    highlights: ['Splendor & Activa', 'Pulsar & Apache', 'CG125, CD70 & Classic 350'],
    badge: 'EXACT FITMENT',
  },
  {
    id: 'special-deals',
    gridPosition: 'COLLECTION 04',
    code: 'GAL-DEAL-04',
    title: 'Special Deal and Offers',
    subtitle: 'Discounted combos, clearance deals',
    description:
      'Exclusive workshop bundle savings up to 35% off on complete periodic service kits, chain-sprocket overhaul sets, and seasonal clearance offers.',
    image: specialDealsImg,
    highlights: ['5-in-1 Service Combo', 'Chain & Sprocket Bundle', 'Up to 35% Off Clearance'],
    badge: 'COMBO-OFFERS!',
  },
];

export const PRODUCTS: SparePartProduct[] = [
  {
    id: 'cc-fm-101',
    sku: 'CC-OIL-10W40',
    name: 'CoilCube EsterCore 4T 10W-40 Full Synthetic Engine Oil (1L)',
    galleryId: 'fast-moving',
    category: 'Fast Moving',
    compatibleBikes: ['All Models', 'Bajaj Pulsar', 'TVS Apache', 'Hero Splendor+', 'Honda CG125 / CD70'],
    originalPrice: 2450,
    price: 1790,
    discountPercent: 27,
    isOnSale: true,
    inStock: true,
    stockCount: 42,
    rating: 4.9,
    reviewCount: 184,
    image: fastMovingImg,
    shortDesc: 'API SP / JASO MA2 wet-clutch certified 100% synthetic ester 4-stroke engine oil for smooth gear shifts and high thermal stability.',
    specs: [
      { label: 'Viscosity Grade', value: 'SAE 10W-40' },
      { label: 'JASO Specification', value: 'JASO MA2 (Anti-Clutch Slip)' },
      { label: 'Drain Interval', value: 'Up to 5,000 km' },
      { label: 'Net Volume', value: '1,000 ml Sealed Bottle' },
    ],
    warranty: '100% Original Seal Guarantee',
  },
  {
    id: 'cc-fm-102',
    sku: 'CC-BRK-SINT09',
    name: 'Ceramic Sintered Front Disc Brake Pad Set',
    galleryId: 'fast-moving',
    category: 'Fast Moving',
    compatibleBikes: ['Bajaj Pulsar', 'TVS Apache', 'Royal Enfield', 'Honda CG125 / CD70'],
    originalPrice: 1650,
    price: 1090,
    discountPercent: 34,
    isOnSale: true,
    inStock: true,
    stockCount: 65,
    rating: 4.8,
    reviewCount: 129,
    image: fastMovingImg,
    shortDesc: 'Zero-fade ceramic friction compound with precision heat-dissipation grooves for instant wet and dry braking performance.',
    specs: [
      { label: 'Friction Material', value: 'Sintered Ceramic Alloy' },
      { label: 'Operating Temp', value: 'Up to 650°C' },
      { label: 'Position', value: 'Front Caliper (Pair of 2 Pads)' },
      { label: 'Rotor Wear Rating', value: 'Low-Abrasion OEM Spec' },
    ],
    warranty: '6 Months Replacement Warranty',
  },
  {
    id: 'cc-fm-103',
    sku: 'CC-FLT-DUAL04',
    name: 'High-Flow Pleated Air Filter & Micro-Glass Oil Filter Set',
    galleryId: 'fast-moving',
    category: 'Fast Moving',
    compatibleBikes: ['Hero Splendor+', 'Honda Activa', 'Bajaj Pulsar', 'TVS Apache', 'Honda CG125 / CD70'],
    originalPrice: 1200,
    price: 850,
    discountPercent: 29,
    isOnSale: false,
    inStock: true,
    stockCount: 90,
    rating: 4.7,
    reviewCount: 94,
    image: fastMovingImg,
    shortDesc: 'Dual-stage polyurethane gasket air element paired with a 15-micron high-pressure oil cartridge filter.',
    specs: [
      { label: 'Filtration Efficiency', value: '99.4% @ 15 Microns' },
      { label: 'Gasket Material', value: 'EPDM Heat-Resistant Seal' },
      { label: 'Kit Contents', value: '1x Air Filter + 1x Oil Filter' },
      { label: 'Service Life', value: '10,000 km Standard' },
    ],
    warranty: 'OEM Fitment Assurance',
  },
  {
    id: 'cc-fm-104',
    sku: 'CC-IGN-IRID8',
    name: 'Laser Iridium IX Fine-Wire High-Energy Spark Plug',
    galleryId: 'fast-moving',
    category: 'Fast Moving',
    compatibleBikes: ['All Models', 'Hero Splendor+', 'Bajaj Pulsar', 'TVS Apache', 'Honda Activa', 'Honda CG125 / CD70', 'Royal Enfield'],
    originalPrice: 1450,
    price: 1050,
    discountPercent: 28,
    isOnSale: false,
    inStock: true,
    stockCount: 55,
    rating: 4.9,
    reviewCount: 210,
    image: fastMovingImg,
    shortDesc: '0.6mm laser-welded iridium center electrode delivers instant cold starts, crisp throttle response, and improved fuel economy.',
    specs: [
      { label: 'Electrode Tip', value: '0.6mm Fine-Wire Iridium Alloy' },
      { label: 'Thread Size', value: 'M10 / M12 Standard Pitch' },
      { label: 'Heat Range', value: '8 (Highway & City Rated)' },
      { label: 'Lifespan', value: '40,000+ km' },
    ],
    warranty: '1 Year Electrode Warranty',
  },
  {
    id: 'cc-cat-201',
    sku: 'CC-ENG-PST150',
    name: 'Forged Aluminum Piston, Rings & Gudgeon Pin Assembly',
    galleryId: 'by-category',
    category: 'Engine Parts',
    compatibleBikes: ['Bajaj Pulsar', 'TVS Apache', 'Hero Splendor+', 'Honda CG125 / CD70'],
    originalPrice: 4200,
    price: 2990,
    discountPercent: 29,
    isOnSale: true,
    inStock: true,
    stockCount: 19,
    rating: 4.9,
    reviewCount: 76,
    image: engineElectricalImg,
    shortDesc: 'Molybdenum-coated skirt forged aluminum piston with nitride steel compression and oil scraper rings.',
    specs: [
      { label: 'Material', value: 'T6-4032 Forged Aluminum Alloy' },
      { label: 'Skirt Coating', value: 'Anti-Scuff Molybdenum Disulfide' },
      { label: 'Included Components', value: 'Piston, 5-Ring Set, Pin, 2x Circlips' },
      { label: 'Compression Ratio', value: '10.2:1 OEM Spec' },
    ],
    warranty: '12 Months Engine Warranty',
  },
  {
    id: 'cc-cat-202',
    sku: 'CC-ELC-COIL18',
    name: 'CoilCube 18-Pole Pure Copper Magneto Stator Ignition Coil',
    galleryId: 'by-category',
    category: 'Electricals',
    compatibleBikes: ['Bajaj Pulsar', 'TVS Apache', 'Royal Enfield', 'Hero Splendor+', 'Honda CG125 / CD70'],
    originalPrice: 3400,
    price: 2350,
    discountPercent: 31,
    isOnSale: true,
    inStock: true,
    stockCount: 28,
    rating: 4.9,
    reviewCount: 162,
    image: engineElectricalImg,
    shortDesc: 'Signature CoilCube 200°C insulated pure electrolytic windings with waterproof pickup sensor for steady battery charging.',
    specs: [
      { label: 'Winding Core', value: '99.9% Electrolytic Copper' },
      { label: 'Poles', value: '18-Pole High-Output Three Phase' },
      { label: 'Insulation Class', value: 'Class H (200°C Thermal Rating)' },
      { label: 'Connector', value: 'Plug-and-Play Waterproof OEM Coupler' },
    ],
    warranty: '18 Months Coil Replacement Warranty',
  },
  {
    id: 'cc-cat-203',
    sku: 'CC-BDY-FND02',
    name: 'High-Impact ABS Front Fender Mudguard & Side Panel Kit',
    galleryId: 'by-category',
    category: 'Body Panels',
    compatibleBikes: ['Bajaj Pulsar', 'TVS Apache', 'Hero Splendor+', 'Honda Activa', 'Honda CG125 / CD70'],
    originalPrice: 3200,
    price: 2290,
    discountPercent: 28,
    isOnSale: false,
    inStock: true,
    stockCount: 24,
    rating: 4.7,
    reviewCount: 58,
    image: bikeModelImg,
    shortDesc: 'UV-stabilized Virgin ABS injection-molded body panel kit in deep piano black and matte silver factory finish.',
    specs: [
      { label: 'Shell Material', value: 'Virgin High-Impact ABS Polymer' },
      { label: 'Paint Finish', value: '3-Stage UV Clearcoat Obsidian Black' },
      { label: 'Mounting Points', value: 'Pre-Drilled Brass Threaded Inserts' },
      { label: 'Fitment Type', value: 'Direct Bolt-On Factory Replacement' },
    ],
    warranty: '1 Year Paint Anti-Fade Guarantee',
  },
  {
    id: 'cc-cat-204',
    sku: 'CC-ACC-CNC6',
    name: '6-Step Adjustable CNC Billet Brake & Clutch Lever Pair',
    galleryId: 'by-category',
    category: 'Accessories',
    compatibleBikes: ['All Models', 'Bajaj Pulsar', 'TVS Apache', 'Royal Enfield', 'Honda CG125 / CD70'],
    originalPrice: 2800,
    price: 1890,
    discountPercent: 33,
    isOnSale: false,
    inStock: true,
    stockCount: 37,
    rating: 4.8,
    reviewCount: 112,
    image: engineElectricalImg,
    shortDesc: '6061-T6 aerospace billet aluminum folding levers in anodized matte black and titanium silver with weighted bar ends.',
    specs: [
      { label: 'Machining', value: '5-Axis CNC 6061-T6 Billet Aluminum' },
      { label: 'Reach Adjustment', value: '6-Position Click Cam Lever' },
      { label: 'Crash Protection', value: '90° Folding Pivot Hinge' },
      { label: 'Finish', value: 'Hard Anodized Matte Black & Silver' },
    ],
    warranty: '1 Year Pivot Mechanism Warranty',
  },
  {
    id: 'cc-mod-301',
    sku: 'CC-CHN-428OR',
    name: 'Heavy-Duty O-Ring Drive Chain & Hardened 42T Sprocket Kit',
    galleryId: 'bike-model',
    category: 'Engine Parts',
    compatibleBikes: ['Hero Splendor+', 'Bajaj Pulsar', 'TVS Apache', 'Honda CG125 / CD70', 'Royal Enfield'],
    originalPrice: 3950,
    price: 2750,
    discountPercent: 30,
    isOnSale: true,
    inStock: true,
    stockCount: 33,
    rating: 4.9,
    reviewCount: 245,
    image: specialDealsImg,
    shortDesc: 'Induction-hardened C45 high-carbon steel front and rear sprockets matched with a pre-lubricated sealed O-ring roller chain.',
    specs: [
      { label: 'Sprocket Steel', value: 'C45 High-Carbon Induction Hardened' },
      { label: 'Chain Pitch', value: '428H / 520 Sealed O-Ring' },
      { label: 'Tensile Strength', value: '24.5 kN Heavy Duty' },
      { label: 'In the Box', value: '14T Front, 42T Rear, 120L Chain + Master Link' },
    ],
    warranty: '20,000 km Sprocket Tooth Warranty',
  },
  {
    id: 'cc-mod-302',
    sku: 'CC-SUS-NTRX2',
    name: 'CoilCube Gas-Charged Chrome & Black Twin Shock Absorber Set',
    galleryId: 'bike-model',
    category: 'Accessories',
    compatibleBikes: ['Hero Splendor+', 'Bajaj Pulsar', 'Honda CG125 / CD70', 'Royal Enfield'],
    originalPrice: 5800,
    price: 4190,
    discountPercent: 28,
    isOnSale: true,
    inStock: true,
    stockCount: 16,
    rating: 4.9,
    reviewCount: 89,
    image: specialDealsImg,
    shortDesc: 'Progressive-rate matte black and chrome coil springs with pressurized nitrogen damping cylinders for superior comfort.',
    specs: [
      { label: 'Damping System', value: 'Monotube Nitrogen Gas + Hydraulic Oil' },
      { label: 'Spring Preload', value: '5-Step Spanner Adjustable Collar' },
      { label: 'Eye-to-Eye Length', value: '325mm - 340mm OEM Spec' },
      { label: 'Piston Rod', value: '12.5mm Hard-Chromed Steel' },
    ],
    warranty: '2 Years Oil-Seal Leak Warranty',
  },
  {
    id: 'cc-mod-303',
    sku: 'CC-WHL-SPK18',
    name: '18-Inch Chrome Spoked Wheel Rim & Drum Hub Complete Assembly',
    galleryId: 'bike-model',
    category: 'Body Panels',
    compatibleBikes: ['Hero Splendor+', 'Honda CG125 / CD70', 'Royal Enfield'],
    originalPrice: 7500,
    price: 5690,
    discountPercent: 24,
    isOnSale: false,
    inStock: true,
    stockCount: 11,
    rating: 4.8,
    reviewCount: 64,
    image: wheelHeroImg,
    shortDesc: 'Factory-trued 36-spoke triple-nickel chrome steel rim laced to a CNC-turned aluminum center hub with dual sealed bearings.',
    specs: [
      { label: 'Rim Size', value: '18 x 1.85 Inch DOT Certified Steel' },
      { label: 'Spoke Count', value: '36 High-Tensile 8G Crossed Spokes' },
      { label: 'Hub Bearings', value: '6301-2RS Pre-Greased Sealed Bearings' },
      { label: 'Radial Runout', value: '< 0.4mm Factory Trued' },
    ],
    warranty: '1 Year Rim Trueness & Chrome Warranty',
  },
  {
    id: 'cc-mod-304',
    sku: 'CC-CLT-ACT6G',
    name: 'Variator Roller Weights, Kevlar V-Belt & Clutch Shoe Kit',
    galleryId: 'bike-model',
    category: 'Engine Parts',
    compatibleBikes: ['Honda Activa'],
    originalPrice: 3100,
    price: 2190,
    discountPercent: 29,
    isOnSale: false,
    inStock: true,
    stockCount: 40,
    rating: 4.8,
    reviewCount: 103,
    image: engineElectricalImg,
    shortDesc: 'Complete CVT transmission refresh kit for Honda Activa eliminates vibration and restores smooth acceleration.',
    specs: [
      { label: 'Belt Material', value: 'Aramid Kevlar Fiber Reinforced EPDM' },
      { label: 'Roller Weight', value: '6x 15g Self-Lubricating Nylon Rollers' },
      { label: 'Clutch Lining', value: 'High-Friction Non-Asbestos Compound' },
      { label: 'Compatibility', value: 'Activa 3G / 4G / 5G / 6G / 125' },
    ],
    warranty: '12 Months Belt Snap Protection',
  },
  {
    id: 'cc-deal-401',
    sku: 'CC-CMB-MSTR5',
    name: 'Master 5-in-1 Periodic Service Combo Pack (Oil + Pads + Filters + Plug)',
    galleryId: 'special-deals',
    category: 'Combo Packs',
    compatibleBikes: ['All Models', 'Hero Splendor+', 'Bajaj Pulsar', 'TVS Apache', 'Honda Activa', 'Honda CG125 / CD70', 'Royal Enfield'],
    originalPrice: 5400,
    price: 3490,
    discountPercent: 35,
    isOnSale: true,
    inStock: true,
    stockCount: 25,
    rating: 5.0,
    reviewCount: 312,
    image: specialDealsImg,
    shortDesc: 'Our #1 bestselling periodic service bundle: 1L 4T Synthetic Oil, Ceramic Front Brake Pads, Air Filter, Oil Filter, and Iridium Spark Plug.',
    specs: [
      { label: 'Bundle Items', value: '5 Genuine OEM Service Components' },
      { label: 'Total Savings', value: 'Flat Rs. 1,910 OFF Individual Price' },
      { label: 'Bonus Included', value: 'Free Drain Crush Washer + Chain Lube Sachet' },
      { label: 'Recommended Every', value: '5,000 km' },
    ],
    warranty: '1 Year Comprehensive Combo Warranty',
  },
  {
    id: 'cc-deal-402',
    sku: 'CC-CMB-LED65',
    name: '65W Bi-LED White Projector Headlight + Relay Harness Combo',
    galleryId: 'special-deals',
    category: 'Electricals',
    compatibleBikes: ['All Models', 'Hero Splendor+', 'Bajaj Pulsar', 'TVS Apache', 'Honda Activa', 'Honda CG125 / CD70', 'Royal Enfield'],
    originalPrice: 3800,
    price: 2590,
    discountPercent: 32,
    isOnSale: true,
    inStock: true,
    stockCount: 31,
    rating: 4.8,
    reviewCount: 147,
    image: specialDealsImg,
    shortDesc: '6000K pure daylight white H4 bi-LED projector bulb with ceramic relay harness and high-speed ball-bearing cooling fan.',
    specs: [
      { label: 'Luminous Flux', value: '8,500 Lumens Precision Cutoff' },
      { label: 'Socket Type', value: 'H4 / HS1 Plug-and-Play' },
      { label: 'Ingress Protection', value: 'IP68 Waterproof & Dustproof' },
      { label: 'Cooling System', value: '12,000 RPM Dual Ball-Bearing Fan' },
    ],
    warranty: '2 Years Instant Bulb Replacement',
  },
];

const SEARCH_SYNONYM_MAP: Record<string, string[]> = {
  engan: ['engine', 'oil', '4t', 'motul'],
  engin: ['engine', 'oil', '4t'],
  enjin: ['engine', 'oil', '4t'],
  injin: ['engine', 'oil', '4t'],
  enjan: ['engine', 'oil', '4t'],
  mubeel: ['engine', 'oil', '4t', 'motul'],
  mobil: ['engine', 'oil', '4t', 'motul'],
  mobiloil: ['engine', 'oil', '4t', 'motul'],
  oyal: ['oil', 'engine', 'motul'],
  aoil: ['oil', 'engine'],
  brik: ['brake', 'pads', 'disc'],
  brek: ['brake', 'pads', 'disc'],
  break: ['brake', 'pads', 'disc'],
  braik: ['brake', 'pads', 'disc'],
  pad: ['brake', 'pads'],
  shoe: ['brake', 'clutch', 'pads'],
  disk: ['disc', 'brake'],
  chen: ['chain', 'sprocket'],
  chan: ['chain', 'sprocket'],
  chane: ['chain', 'sprocket'],
  garari: ['chain', 'sprocket', 'kit'],
  grari: ['chain', 'sprocket', 'kit'],
  spoket: ['sprocket', 'chain'],
  sproket: ['sprocket', 'chain'],
  filtar: ['filter', 'air', 'oil'],
  filtter: ['filter', 'air', 'oil'],
  fiter: ['filter', 'air', 'oil'],
  plag: ['plug', 'spark', 'iridium'],
  plug: ['plug', 'spark', 'iridium'],
  cluch: ['clutch', 'plates', 'kevlar'],
  kluch: ['clutch', 'plates'],
  batry: ['battery', 'amaron', '12v'],
  batery: ['battery', 'amaron', '12v'],
  bettry: ['battery', 'amaron', '12v'],
  battrey: ['battery', 'amaron', '12v'],
  shok: ['shock', 'absorber', 'suspension'],
  shocker: ['shock', 'absorber', 'suspension'],
  jump: ['shock', 'absorber', 'suspension'],
  tayer: ['wheel', 'rim', 'spoke', 'tire'],
  tyre: ['wheel', 'rim', 'spoke', 'tire'],
  tire: ['wheel', 'rim', 'spoke', 'tire'],
  spok: ['spoke', 'wheel', 'rim'],
  rim: ['wheel', 'rim', 'spoke'],
  coel: ['coil', 'stator', 'magnet'],
  magnet: ['stator', 'coil', 'electricals'],
  wiring: ['electricals', 'relay', 'harness'],
  light: ['led', 'headlight', 'projector'],
  headlight: ['led', 'headlight', 'projector', 'visor'],
  visor: ['visor', 'cowling', 'headlamp'],
  wijer: ['visor', 'cowling'],
  tapa: ['panel', 'side', 'cover', 'body'],
  tanki: ['body', 'panel', 'cover'],
  pistun: ['piston', 'cylinder', 'ring'],
  splander: ['splendor'],
  splender: ['splendor'],
  pulser: ['pulsar'],
  apachi: ['apache'],
  hunda: ['honda', 'cg125', 'cd70', 'activa'],
  cd70: ['cg125', 'cd70', 'honda'],
  cg125: ['cg125', 'cd70', 'honda'],
};

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

export function matchesProductQuery(
  product: SparePartProduct,
  rawQuery: string
): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const searchableText = [
    product.name,
    product.sku,
    product.category,
    product.shortDesc,
    ...product.compatibleBikes,
    ...product.specs.map((s) => `${s.label} ${s.value}`),
  ]
    .join(' ')
    .toLowerCase();

  // Direct substring match
  if (searchableText.includes(q)) return true;

  const searchableWords = searchableText
    .replace(/[^a-z0-9+]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const queryTokens = q
    .replace(/[^a-z0-9+]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (queryTokens.length === 0) return true;

  // Every token in the user's query should match either directly, via synonym, or via fuzzy typo tolerance
  return queryTokens.every((token) => {
    if (searchableText.includes(token)) return true;

    // Check synonym/Roman-Urdu dictionary
    const mappedSynonyms = SEARCH_SYNONYM_MAP[token];
    if (
      mappedSynonyms &&
      mappedSynonyms.some((syn) => searchableText.includes(syn))
    ) {
      return true;
    }

    // Check partial key match in synonym map
    for (const [key, syns] of Object.entries(SEARCH_SYNONYM_MAP)) {
      if (token.length >= 3 && (key.startsWith(token) || token.startsWith(key))) {
        if (syns.some((syn) => searchableText.includes(syn))) {
          return true;
        }
      }
    }

    // Fuzzy token comparison (handles typos like "engan" -> "engine", "syntetic" -> "synthetic")
    if (token.length >= 4) {
      const maxAllowedDist = token.length >= 6 ? 2 : 1;
      for (const word of searchableWords) {
        if (word.length < 3) continue;
        if (word.startsWith(token.slice(0, 3)) && editDistance(token, word) <= 2) {
          return true;
        }
        if (editDistance(token, word) <= maxAllowedDist) {
          return true;
        }
      }
    }

    return false;
  });
}

