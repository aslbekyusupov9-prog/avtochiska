// ============================================================
// liveSync.js — Supabase Direct Sync
// ============================================================
import { supabase } from '../lib/supabase';

const TABLE = 'site_data';
const ROW_ID = 'main';

// BroadcastChannel — bir browserda tab sync uchun (realtime fallback)
const syncChannel =
  typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('tozalik_ustasi_channel')
    : null;

/**
 * Supabase'dan barcha site ma'lumotlarini o'qish (direct query).
 * @returns {Promise<Object|null>}
 */
export async function fetchLiveCloudState() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', ROW_ID)
      .single();

    if (error || !data) {
      if (error) console.error('[liveSync] fetchLiveCloudState error:', error.message);
      return null;
    }

    const fetchedCarTypes = (Array.isArray(data.car_types) && data.car_types.length > 0)
      ? data.car_types
      : (Array.isArray(data.site_info?.carTypes) ? data.site_info.carTypes : []);

    return {
      orders: data.orders ?? [],
      gallery: data.gallery ?? [],
      services: Array.isArray(data.services) ? data.services : [],
      carTypes: Array.isArray(fetchedCarTypes) ? fetchedCarTypes : [],
      reviews: data.reviews ?? [],
      heroContent: data.hero_content ?? {},
      siteInfo: data.site_info ?? {},
    };
  } catch (err) {
    console.error('[liveSync] fetchLiveCloudState exception:', err);
    return null;
  }
}

/**
 * Supabase'ga site ma'lumotlarini saqlash (direct upsert to Supabase).
 * @param {Object} data
 */
export async function saveLiveCloudState(data) {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SYNC_STATE', payload: data });
    } catch (_) {}
  }

  if (!supabase) {
    console.error('[liveSync] Supabase klienti yo\'q.');
    return;
  }

  const siteInfoWithCarTypes = {
    ...(data.siteInfo || {}),
    carTypes: data.carTypes || []
  };

  const payloadPrimary = {
    id: ROW_ID,
    orders: data.orders ?? [],
    gallery: data.gallery ?? [],
    services: data.services ?? [],
    car_types: data.carTypes ?? [],
    reviews: data.reviews ?? [],
    hero_content: data.heroContent ?? {},
    site_info: siteInfoWithCarTypes,
  };

  try {
    const { error } = await supabase.from(TABLE).upsert(payloadPrimary, { onConflict: 'id' });
    if (error) {
      console.error('[liveSync] Supabase saqlashda xatolik:', error.message);
    } else {
      console.log("[liveSync] Supabase cloud-ga to'g'ridan-to'g'ri saqlandi ✓");
    }
  } catch (err) {
    console.error('[liveSync] Supabase save exception:', err);
  }
}

/**
 * Supabase Realtime + BroadcastChannel orqali o'zgarishlarni kuzatish.
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export function subscribeToTabSync(callback) {
  const unsubscribes = [];

  // 1. BroadcastChannel (bir xil browser ichida)
  if (syncChannel) {
    const handler = (event) => {
      if (event.data && event.data.type === 'SYNC_STATE') {
        callback(event.data.payload);
      }
    };
    syncChannel.addEventListener('message', handler);
    unsubscribes.push(() => syncChannel.removeEventListener('message', handler));
  }

  // 2. Supabase Realtime (boshqa qurilmalar uchun)
  if (supabase) {
    const channelName = `site_data_realtime_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: TABLE, filter: `id=eq.${ROW_ID}` },
        (payload) => {
          const row = payload.new;
          if (!row) return;

          const fetchedCarTypes = (Array.isArray(row.car_types) && row.car_types.length > 0)
            ? row.car_types
            : (Array.isArray(row.site_info?.carTypes) ? row.site_info.carTypes : []);

          callback({
            orders: row.orders ?? [],
            gallery: row.gallery ?? [],
            services: row.services ?? [],
            carTypes: fetchedCarTypes,
            reviews: row.reviews ?? [],
            heroContent: row.hero_content ?? {},
            siteInfo: row.site_info ?? {},
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[liveSync] Supabase Realtime ulandi ✓');
        }
      });

    unsubscribes.push(() => {
      supabase.removeChannel(channel);
    });
  }

  return () => {
    unsubscribes.forEach((fn) => fn());
  };
}
