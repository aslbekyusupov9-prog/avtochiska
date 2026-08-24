// ============================================================
// liveSync.js — Bulletproof Supabase Direct & Realtime Sync
// ============================================================
import { supabase } from '../lib/supabase';

const TABLE = 'site_data';
const ROW_ID = 'main';

const syncChannel =
  typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('tozalik_ustasi_channel')
    : null;

/**
 * Supabase'dan va lokal zaxiradan site ma'lumotlarini o'qish.
 */
export async function fetchLiveCloudState() {
  let localBackup = null;
  try {
    const raw = localStorage.getItem('af_live_backup_v1') || sessionStorage.getItem('af_live_backup_v1');
    if (raw) localBackup = JSON.parse(raw);
  } catch (_) {}

  if (!supabase) return localBackup;

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', ROW_ID)
      .single();

    if (error || !data) {
      if (error) console.error('[liveSync] fetchLiveCloudState error:', error.message);
      return localBackup;
    }

    const fetchedCarTypes = (Array.isArray(data.car_types) && data.car_types.length > 0)
      ? data.car_types
      : (Array.isArray(data.site_info?.carTypes) ? data.site_info.carTypes : (localBackup?.carTypes || []));

    const fetchedServices = (Array.isArray(data.services) && data.services.length > 0)
      ? data.services
      : (localBackup?.services || []);

    const result = {
      orders: (Array.isArray(data.orders) && data.orders.length > 0) ? data.orders : (localBackup?.orders || []),
      gallery: (Array.isArray(data.gallery) && data.gallery.length > 0) ? data.gallery : (localBackup?.gallery || []),
      services: fetchedServices,
      carTypes: fetchedCarTypes,
      reviews: (Array.isArray(data.reviews) && data.reviews.length > 0) ? data.reviews : (localBackup?.reviews || []),
      heroContent: (data.hero_content && Object.keys(data.hero_content).length > 0) ? data.hero_content : (localBackup?.heroContent || {}),
      siteInfo: (data.site_info && Object.keys(data.site_info).length > 0) ? data.site_info : (localBackup?.siteInfo || {}),
    };

    try {
      localStorage.setItem('af_live_backup_v1', JSON.stringify(result));
    } catch (_) {}

    return result;
  } catch (err) {
    console.error('[liveSync] fetchLiveCloudState exception:', err);
    return localBackup;
  }
}

/**
 * Supabase'ga va lokal saqlash (dual-sync with schema fallback).
 */
export async function saveLiveCloudState(data) {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SYNC_STATE', payload: data });
    } catch (_) {}
  }

  try {
    localStorage.setItem('af_live_backup_v1', JSON.stringify(data));
    sessionStorage.setItem('af_live_backup_v1', JSON.stringify(data));
  } catch (_) {}

  if (!supabase) return;

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

  const payloadFallback = {
    id: ROW_ID,
    orders: data.orders ?? [],
    gallery: data.gallery ?? [],
    services: data.services ?? [],
    reviews: data.reviews ?? [],
    hero_content: data.heroContent ?? {},
    site_info: siteInfoWithCarTypes,
  };

  try {
    const { error } = await supabase.from(TABLE).upsert(payloadPrimary, { onConflict: 'id' });
    if (error) {
      console.warn('[liveSync] Primary schema error, trying fallback:', error.message);
      const { error: fallbackErr } = await supabase.from(TABLE).upsert(payloadFallback, { onConflict: 'id' });
      if (fallbackErr) {
        console.error('[liveSync] Supabase saqlashda xatolik:', fallbackErr.message);
      } else {
        console.log('[liveSync] Supabase fallback orqali saqlandi ✓');
      }
    } else {
      console.log('[liveSync] Supabase cloud-ga saqlandi ✓');
    }
  } catch (err) {
    console.error('[liveSync] Supabase save exception:', err);
  }
}

/**
 * Supabase Realtime + BroadcastChannel.
 */
export function subscribeToTabSync(callback) {
  const unsubscribes = [];

  if (syncChannel) {
    const handler = (event) => {
      if (event.data && event.data.type === 'SYNC_STATE') {
        callback(event.data.payload);
      }
    };
    syncChannel.addEventListener('message', handler);
    unsubscribes.push(() => syncChannel.removeEventListener('message', handler));
  }

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
