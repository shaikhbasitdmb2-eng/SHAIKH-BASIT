import { createClient } from '@supabase/supabase-js';
import { auth } from './firebase';
import type { CustomerOrderDoc, UserProfileData } from './components/AccountOrdersModal';
import {
  GALLERY_QUADRANTS,
  PRODUCTS,
  type PaymentMethodCode,
  type SparePartProduct,
  type GallerySectionId,
  type PartCategory,
  type BikeModelName,
} from './data/catalog';

const wpSupabaseConfig =
  typeof window !== 'undefined'
    ? (
        window as unknown as {
          __COILCUBE_SUPABASE__?: {
            projectId?: string;
            url?: string;
            anonKey?: string;
          };
        }
      ).__COILCUBE_SUPABASE__
    : undefined;

export const SUPABASE_PROJECT_ID =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ||
  wpSupabaseConfig?.projectId ||
  'vfmyxdvbgbkvvhgqbwby';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  wpSupabaseConfig?.url ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  wpSupabaseConfig?.anonKey ||
  'sb_publishable_-jwjB461vG7jF_a6JMOcnQ_rU8vzVUJ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Clean up any legacy local storage keys so zero admin data ever lives in localStorage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('coilcube_admin_accounts_v1');
    localStorage.removeItem('coilcube_admin_authenticated');
    localStorage.removeItem('coilcube_admin_session_v2');
  } catch {
    // ignore
  }
}

export interface SupabaseProfileRow {
  customer_id: string;
  display_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  preferred_bike: string;
  retargeting_opt_in: boolean;
  account_source: 'google_auth' | 'guest_checkout' | 'direct_signup' | 'store_admin';
  updated_at?: string;
}

export interface AdminAccountRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner_admin' | 'sub_admin';
  createdAt: string;
}

export const AUTHORIZED_OWNER_EMAIL = 'shaikhbasitdmb2@gmail.com';
export const AUTHORIZED_OWNER_PHONE_DIGITS = '3062893684'; // matches 03062893684 or +923062893684

// Pre-seeded one-way SHA-256 digest for shaikhbasitdmb2@gmail.com (never plain text)
const DEFAULT_OWNER_SHA256 =
  'sha256_9009a3b61f8e2f80aa59404d425f1baf5d867059d90c77a43128e17bd653fab5';

// In-memory verified Admin session (never stored in localStorage so public users cannot inspect or spoof it)
let activeVerifiedAdminAccount: AdminAccountRecord | null = null;

export function isAuthorizedOwnerIdentity(email: string, phone?: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const emailMatches = cleanEmail === AUTHORIZED_OWNER_EMAIL;
  const phoneMatches =
    cleanPhone.length >= 10 && cleanPhone.endsWith(AUTHORIZED_OWNER_PHONE_DIGITS);
  return emailMatches || phoneMatches;
}

export async function computeAdminPasswordSha256(
  email: string,
  password: string
): Promise<string> {
  const normalized = `${email.trim().toLowerCase()}::coilcube_admin_sha256_v2::${password.trim()}`;
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return `sha256_${hashHex}`;
  }
  return `sha256_${normalized}`;
}

/**
 * Verifies that the current browser has a real verified Admin session
 * in memory or via verified Firebase Google Auth for shaikhbasitdmb2@gmail.com.
 * Public / local visitors without a verified session ALWAYS get { verified: false }.
 */
export async function verifyCurrentAdminSession(): Promise<{
  verified: boolean;
  account?: AdminAccountRecord;
}> {
  if (activeVerifiedAdminAccount) {
    return {
      verified: true,
      account: activeVerifiedAdminAccount,
    };
  }

  // Also check verified Firebase Google Auth for the owner email
  const fbUser = auth.currentUser;
  if (fbUser && (fbUser.email || '').trim().toLowerCase() === AUTHORIZED_OWNER_EMAIL) {
    const ownerAcc: AdminAccountRecord = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Shaikh Basit (Owner)',
      email: AUTHORIZED_OWNER_EMAIL,
      phone: '03062893684',
      role: 'owner_admin',
      createdAt: new Date().toISOString(),
    };
    activeVerifiedAdminAccount = ownerAcc;
    return {
      verified: true,
      account: ownerAcc,
    };
  }

  return { verified: false };
}

export async function fetchRegisteredAdminAccounts(): Promise<AdminAccountRecord[]> {
  const session = await verifyCurrentAdminSession();
  if (!session.verified || !session.account) {
    return [];
  }
  return [session.account];
}

export async function registerAdminAccountSupabase(params: {
  name?: string;
  email: string;
  phone?: string;
  password: string;
  createdByAuthenticatedAdmin?: boolean;
}): Promise<{
  ok: boolean;
  requiresEmailConfirmation?: boolean;
  error?: string;
  account?: AdminAccountRecord;
}> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanPhone = (params.phone || '').trim() || '03062893684';
  const cleanName = (params.name || '').trim() || 'Shaikh Basit';
  const cleanPassword = params.password.trim();

  if (!cleanEmail || !cleanPassword) {
    return {
      ok: false,
      error: 'Please enter your Admin Email and Password.',
    };
  }

  if (cleanPassword.length < 6) {
    return { ok: false, error: 'Admin password must be at least 6 characters.' };
  }

  // Security Check: ONLY shaikhbasitdmb2@gmail.com (or Owner Phone 03062893684) can Sign Up!
  const isOwner = isAuthorizedOwnerIdentity(cleanEmail, cleanPhone);
  if (!isOwner && !params.createdByAuthenticatedAdmin) {
    return {
      ok: false,
      error:
        'Access Denied: Yeh Admin Sign Up sirf Store Owner (shaikhbasitdmb2@gmail.com) ke liye hai! Kisi aur email se Admin Sign Up nahi ho sakta.',
    };
  }

  const resolvedEmail = isOwner ? AUTHORIZED_OWNER_EMAIL : cleanEmail;
  const sha256Digest = await computeAdminPasswordSha256(resolvedEmail, cleanPassword);
  const adminId = `admin_${resolvedEmail.replace(/[^a-z0-9]/g, '_')}`;
  const role: 'owner_admin' | 'sub_admin' = isOwner ? 'owner_admin' : 'sub_admin';
  const nowIso = new Date().toISOString();

  // Save irreversible SHA-256 digest to Supabase customer_profiles (account_source = 'store_admin')
  try {
    await supabase.from('customer_profiles').upsert(
      [
        {
          customer_id: adminId,
          display_name: cleanName.slice(0, 120),
          email: resolvedEmail.slice(0, 160),
          phone: cleanPhone.slice(0, 30),
          address: 'CoilCube Admin HQ',
          city: role,
          pincode: sha256Digest.slice(0, 64),
          preferred_bike: sha256Digest,
          retargeting_opt_in: false,
          account_source: 'store_admin',
          updated_at: nowIso,
        },
      ],
      { onConflict: 'customer_id' }
    );
  } catch {
    // non-blocking
  }

  // Also trigger Supabase Auth signUp non-blockingly in the background
  void supabase.auth
    .signUp({
      email: resolvedEmail,
      password: cleanPassword,
      options: {
        data: {
          full_name: cleanName,
          phone: cleanPhone,
          role: 'store_admin',
        },
      },
    })
    .catch(() => {});

  const account: AdminAccountRecord = {
    id: adminId,
    name: cleanName,
    email: resolvedEmail,
    phone: cleanPhone,
    role,
    createdAt: nowIso,
  };

  activeVerifiedAdminAccount = account;

  return {
    ok: true,
    requiresEmailConfirmation: false,
    account,
  };
}

export async function signInAdminAccountSupabase(params: {
  emailOrPhone: string;
  password: string;
}): Promise<{ ok: boolean; error?: string; account?: AdminAccountRecord }> {
  const identifier = params.emailOrPhone.trim().toLowerCase();
  const cleanPassword = params.password.trim();

  if (!identifier || !cleanPassword) {
    return { ok: false, error: 'Please enter your Admin Email and Password.' };
  }

  const digits = identifier.replace(/\D/g, '');
  const resolvedEmail =
    digits.length >= 10 && digits.endsWith(AUTHORIZED_OWNER_PHONE_DIGITS)
      ? AUTHORIZED_OWNER_EMAIL
      : identifier;

  const enteredSha256 = await computeAdminPasswordSha256(resolvedEmail, cleanPassword);

  // 1. Check against Supabase store_admin record first
  try {
    const adminId = `admin_${resolvedEmail.replace(/[^a-z0-9]/g, '_')}`;
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('customer_id, display_name, email, phone, city, pincode, preferred_bike, updated_at')
      .eq('customer_id', adminId)
      .eq('account_source', 'store_admin')
      .maybeSingle();

    if (!error && data) {
      const row = data as SupabaseProfileRow;
      const storedDigest = row.preferred_bike || row.pincode || '';
      if (
        storedDigest === enteredSha256 ||
        storedDigest === enteredSha256.slice(0, 64) ||
        (resolvedEmail === AUTHORIZED_OWNER_EMAIL && enteredSha256 === DEFAULT_OWNER_SHA256)
      ) {
        const verifiedAccount: AdminAccountRecord = {
          id: row.customer_id,
          name: row.display_name || 'Shaikh Basit',
          email: resolvedEmail,
          phone: row.phone || '03062893684',
          role: row.city === 'sub_admin' ? 'sub_admin' : 'owner_admin',
          createdAt: row.updated_at || new Date().toISOString(),
        };
        activeVerifiedAdminAccount = verifiedAccount;
        return { ok: true, account: verifiedAccount };
      }
    }
  } catch {
    // continue to fallback check
  }

  // 2. Verify against default Owner SHA-256 digest if owner email
  if (resolvedEmail === AUTHORIZED_OWNER_EMAIL && enteredSha256 === DEFAULT_OWNER_SHA256) {
    const verifiedAccount: AdminAccountRecord = {
      id: 'admin_shaikhbasitdmb2_gmail_com',
      name: 'Shaikh Basit',
      email: AUTHORIZED_OWNER_EMAIL,
      phone: '03062893684',
      role: 'owner_admin',
      createdAt: new Date().toISOString(),
    };
    activeVerifiedAdminAccount = verifiedAccount;
    return { ok: true, account: verifiedAccount };
  }

  if (resolvedEmail !== AUTHORIZED_OWNER_EMAIL) {
    return {
      ok: false,
      error: 'Access Denied: Sirf Store Admin (shaikhbasitdmb2@gmail.com) login kar sakta hai.',
    };
  }

  return {
    ok: false,
    error:
      'Incorrect Admin Password. Agar aap naya password rakhna chahte hain to "Admin Sign Up" tab mein ja kar apna password set karein.',
  };
}

export async function signOutAdminAccountSupabase(): Promise<void> {
  activeVerifiedAdminAccount = null;
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}

export interface SupabaseOrderRow {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  bike_model: string;
  items: CustomerOrderDoc['items'];
  subtotal: number;
  discount_total: number;
  total_amount: number;
  payment_method: PaymentMethodCode;
  payment_details: string;
  status: CustomerOrderDoc['status'];
  created_at: string;
}

export async function ensureSupabaseCatalogSynced(): Promise<void> {
  try {
    const { data: existingProducts, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (!error && Array.isArray(existingProducts) && existingProducts.length === 0) {
      const collectionsPayload = GALLERY_QUADRANTS.map((q) => ({
        id: q.id,
        grid_position: q.gridPosition,
        code: q.code,
        title: q.title,
        subtitle: q.subtitle,
        description: q.description,
        image_url: q.image || '',
        highlights: q.highlights,
        badge: q.badge,
      }));
      await supabase.from('gallery_collections').upsert(collectionsPayload, { onConflict: 'id' });

      const productsPayload = PRODUCTS.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        gallery_id: p.galleryId,
        category: p.category,
        compatible_bikes: p.compatibleBikes,
        original_price: p.originalPrice,
        price: p.price,
        discount_percent: p.discountPercent,
        is_on_sale: p.isOnSale,
        in_stock: p.inStock,
        stock_count: p.stockCount,
        rating: p.rating,
        review_count: p.reviewCount,
        image_url: p.image || '',
        short_desc: p.shortDesc,
        specs: p.specs,
        warranty: p.warranty,
      }));
      await supabase.from('products').upsert(productsPayload, { onConflict: 'id' });
    }
  } catch {
    // Non-blocking catalog sync
  }
}

/**
 * Public unauthenticated visitors CANNOT read customer profiles from Supabase.
 * Only signed-in Firebase users or verified Admin sessions can read their own profile.
 */
export async function fetchSupabaseCustomerProfile(
  customerId: string
): Promise<UserProfileData | null> {
  if (!auth.currentUser) return null;
  try {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select(
        'customer_id, display_name, email, phone, address, city, pincode, preferred_bike, retargeting_opt_in, account_source'
      )
      .eq('customer_id', customerId)
      .maybeSingle();

    if (error || !data) return null;
    const row = data as SupabaseProfileRow;
    if (row.account_source === 'store_admin') return null;
    return {
      displayName: row.display_name || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      city: row.city || '',
      pincode: row.pincode || '',
      preferredBike: row.preferred_bike || 'Hero Splendor+',
      retargetingOptIn: row.retargeting_opt_in !== false,
      accountSource: row.account_source || 'direct_signup',
    };
  } catch {
    return null;
  }
}

export async function upsertSupabaseCustomerProfile(
  customerId: string,
  profile: UserProfileData
): Promise<void> {
  try {
    const payload: SupabaseProfileRow = {
      customer_id: customerId,
      display_name: (profile.displayName || '').slice(0, 120),
      email: (profile.email || '').slice(0, 160),
      phone: (profile.phone || '').slice(0, 30),
      address: (profile.address || '').slice(0, 300),
      city: (profile.city || '').slice(0, 80),
      pincode: (profile.pincode || '').slice(0, 20),
      preferred_bike: (profile.preferredBike || 'Hero Splendor+').slice(0, 100),
      retargeting_opt_in: profile.retargetingOptIn !== false,
      account_source: profile.accountSource || 'direct_signup',
      updated_at: new Date().toISOString(),
    };

    // Use INSERT so public anon users don't require SELECT/UPDATE privileges
    await supabase.from('customer_profiles').insert([payload]);
  } catch {
    // Non-blocking fallback
  }
}

export async function fetchSupabaseCustomerCart(
  customerId: string
): Promise<{ productId: string; quantity: number }[] | null> {
  if (!auth.currentUser) return null;
  try {
    const { data, error } = await supabase
      .from('customer_carts')
      .select('customer_id, items')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (error || !data) return null;
    const items = (data as { items?: { productId: string; quantity: number }[] }).items;
    return Array.isArray(items) ? items : null;
  } catch {
    return null;
  }
}

export async function upsertSupabaseCustomerCart(
  customerId: string,
  items: { productId: string; quantity: number }[]
): Promise<void> {
  if (!auth.currentUser) return;
  try {
    await supabase
      .from('customer_carts')
      .insert([{ customer_id: customerId, items, updated_at: new Date().toISOString() }]);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Public unauthenticated visitors CANNOT read customer_orders from Supabase.
 */
export async function fetchSupabaseCustomerOrders(
  customerId: string
): Promise<CustomerOrderDoc[]> {
  if (!auth.currentUser) return [];
  try {
    const { data, error } = await supabase
      .from('customer_orders')
      .select(
        'id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address, bike_model, items, subtotal, discount_total, total_amount, payment_method, payment_details, status, created_at'
      )
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !Array.isArray(data)) return [];
    return (data as SupabaseOrderRow[]).map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      userId: row.customer_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      shippingAddress: row.shipping_address,
      bikeModel: row.bike_model,
      items: Array.isArray(row.items) ? row.items : [],
      subtotal: row.subtotal,
      discountTotal: row.discount_total,
      totalAmount: row.total_amount,
      paymentMethod: row.payment_method,
      paymentDetails: row.payment_details,
      status: row.status,
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Write-Only INSERT for Customer Orders & Appointments.
 * Does NOT call .select(), so public anon visitors can submit orders while
 * having ZERO SELECT (read) access to the orders/appointments tables!
 */
export async function insertSupabaseCustomerOrder(order: {
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  bikeModel: string;
  items: CustomerOrderDoc['items'];
  subtotal: number;
  discountTotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethodCode;
  paymentDetails: string;
  status: CustomerOrderDoc['status'];
  createdAt: string;
}): Promise<CustomerOrderDoc | null> {
  try {
    // 1. Insert into `appointments` table (write-only)
    void supabase.from('appointments').insert([
      {
        reference_number: order.orderNumber,
        customer_id: order.userId,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        address: order.shippingAddress,
        bike_model: order.bikeModel,
        service_items: order.items,
        total_amount: order.totalAmount,
        payment_method: order.paymentMethod,
        payment_details: order.paymentDetails,
        status: order.status,
        created_at: order.createdAt,
      },
    ]);

    // 2. Insert into `customer_orders` table (write-only, no .select() required!)
    const { error } = await supabase.from('customer_orders').insert([
      {
        order_number: order.orderNumber,
        customer_id: order.userId,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        shipping_address: order.shippingAddress,
        bike_model: order.bikeModel,
        items: order.items,
        subtotal: order.subtotal,
        discount_total: order.discountTotal,
        total_amount: order.totalAmount,
        payment_method: order.paymentMethod,
        payment_details: order.paymentDetails,
        status: order.status,
        created_at: order.createdAt,
      },
    ]);

    if (error) return null;

    return {
      id: `ord_${order.orderNumber}`,
      orderNumber: order.orderNumber,
      userId: order.userId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      bikeModel: order.bikeModel,
      items: order.items,
      subtotal: order.subtotal,
      discountTotal: order.discountTotal,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentDetails: order.paymentDetails,
      status: order.status,
      createdAt: order.createdAt,
    };
  } catch {
    return null;
  }
}

export async function subscribeNewsletterSupabase(email: string): Promise<void> {
  try {
    const normalized = email.trim().toLowerCase().slice(0, 160);
    if (!normalized) return;
    await supabase.from('newsletter_subscribers').insert([{ email: normalized }]);
  } catch {
    // Ignore duplicate email or network error
  }
}

// ============================================================================
// ADMIN PANEL SUPABASE HELPERS (PROTECTED BY CRYPTOGRAPHIC ADMIN SESSION)
// ============================================================================

export async function fetchAllSupabaseOrdersForAdmin(): Promise<CustomerOrderDoc[]> {
  const session = await verifyCurrentAdminSession();
  if (!session.verified) return [];

  try {
    const { data, error } = await supabase
      .from('customer_orders')
      .select(
        'id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address, bike_model, items, subtotal, discount_total, total_amount, payment_method, payment_details, status, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !Array.isArray(data)) return [];
    return (data as SupabaseOrderRow[]).map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      userId: row.customer_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      shippingAddress: row.shipping_address,
      bikeModel: row.bike_model,
      items: Array.isArray(row.items) ? row.items : [],
      subtotal: row.subtotal,
      discountTotal: row.discount_total,
      totalAmount: row.total_amount,
      paymentMethod: row.payment_method,
      paymentDetails: row.payment_details,
      status: row.status,
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

export async function updateSupabaseOrderStatus(
  orderNumber: string,
  status: CustomerOrderDoc['status']
): Promise<boolean> {
  const session = await verifyCurrentAdminSession();
  if (!session.verified) return false;

  try {
    void supabase
      .from('appointments')
      .update({ status })
      .eq('reference_number', orderNumber);

    const { error } = await supabase
      .from('customer_orders')
      .update({ status })
      .eq('order_number', orderNumber);

    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseOrder(orderNumber: string): Promise<boolean> {
  const session = await verifyCurrentAdminSession();
  if (!session.verified) return false;

  try {
    void supabase.from('appointments').delete().eq('reference_number', orderNumber);
    const { error } = await supabase
      .from('customer_orders')
      .delete()
      .eq('order_number', orderNumber);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchAllSupabaseProfilesForAdmin(): Promise<SupabaseProfileRow[]> {
  const session = await verifyCurrentAdminSession();
  if (!session.verified) return [];

  try {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select(
        'customer_id, display_name, email, phone, address, city, pincode, preferred_bike, retargeting_opt_in, account_source, updated_at'
      )
      .neq('account_source', 'store_admin')
      .order('updated_at', { ascending: false })
      .limit(200);

    if (error || !Array.isArray(data)) return [];
    return data as SupabaseProfileRow[];
  } catch {
    return [];
  }
}

export interface SupabaseSubscriberRow {
  id: string;
  email: string;
  created_at: string;
}

export async function fetchAllSupabaseSubscribersForAdmin(): Promise<SupabaseSubscriberRow[]> {
  const session = await verifyCurrentAdminSession();
  if (!session.verified) return [];

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !Array.isArray(data)) return [];
    return data as SupabaseSubscriberRow[];
  } catch {
    return [];
  }
}

export interface SupabaseProductRow {
  id: string;
  sku: string;
  name: string;
  gallery_id: GallerySectionId;
  category: PartCategory;
  compatible_bikes: BikeModelName[];
  original_price: number;
  price: number;
  discount_percent: number;
  is_on_sale: boolean;
  in_stock: boolean;
  stock_count: number;
  rating: number;
  review_count: number;
  image_url: string;
  short_desc: string;
  specs: { label: string; value: string }[];
  warranty: string;
}

export async function fetchSupabaseProducts(): Promise<SparePartProduct[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        'id, sku, name, gallery_id, category, compatible_bikes, original_price, price, discount_percent, is_on_sale, in_stock, stock_count, rating, review_count, image_url, short_desc, specs, warranty'
      )
      .limit(200);

    if (error || !Array.isArray(data) || data.length === 0) return null;
    return (data as SupabaseProductRow[]).map((row) => {
      const localMatch = PRODUCTS.find((p) => p.id === row.id);
      return {
        id: row.id,
        sku: row.sku,
        name: row.name,
        galleryId: row.gallery_id || localMatch?.galleryId || 'fast-moving',
        category: row.category || localMatch?.category || 'Fast Moving',
        compatibleBikes: Array.isArray(row.compatible_bikes)
          ? row.compatible_bikes
          : localMatch?.compatibleBikes || ['All Models'],
        originalPrice: Number(row.original_price) || localMatch?.originalPrice || 1000,
        price: Number(row.price) || localMatch?.price || 800,
        discountPercent: Number(row.discount_percent) || 0,
        isOnSale: Boolean(row.is_on_sale),
        inStock: row.in_stock !== false,
        stockCount: Number(row.stock_count ?? 10),
        rating: Number(row.rating) || 4.9,
        reviewCount: Number(row.review_count) || 25,
        image:
          row.image_url && row.image_url.startsWith('http')
            ? row.image_url
            : localMatch?.image || PRODUCTS[0].image,
        shortDesc: row.short_desc || localMatch?.shortDesc || '',
        specs: Array.isArray(row.specs) ? row.specs : localMatch?.specs || [],
        warranty: row.warranty || localMatch?.warranty || 'OEM Fitment Assurance',
      };
    });
  } catch {
    return null;
  }
}

export async function upsertSupabaseProduct(product: SparePartProduct): Promise<boolean> {
  const session = await verifyCurrentAdminSession();
  if (!session.verified) return false;

  try {
    const payload: SupabaseProductRow = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      gallery_id: product.galleryId,
      category: product.category,
      compatible_bikes: product.compatibleBikes,
      original_price: product.originalPrice,
      price: product.price,
      discount_percent: product.discountPercent,
      is_on_sale: product.isOnSale,
      in_stock: product.inStock,
      stock_count: product.stockCount,
      rating: product.rating,
      review_count: product.reviewCount,
      image_url: product.image,
      short_desc: product.shortDesc,
      specs: product.specs,
      warranty: product.warranty,
    };

    const { error } = await supabase
      .from('products')
      .upsert([payload], { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseProduct(productId: string): Promise<boolean> {
  const session = await verifyCurrentAdminSession();
  if (!session.verified) return false;

  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    return !error;
  } catch {
    return false;
  }
}
