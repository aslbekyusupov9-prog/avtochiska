// ============================================================
// liveSync.js — Supabase Realtime + BroadcastChannel fallback
// ============================================================
import { supabase } from '../lib/supabase';

const TABLE = 'site_data';
const ROW_ID = 'main';

// BroadcastChannel — bir browserda tab sync uchun (fallback)
const syncChannel =
  typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('tozalik_ustasi_channel')
    : null;

/**
 * Supabase'dan barcha site ma'lumotlarini olish.
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

    if (error) {
      console.error('[liveSync] fetchLiveCloudState error:', error.message);
      return null;
    }

    if (!data) return null;

    // snake_case → camelCase
    return {
      orders: data.orders ?? [],
      gallery: data.gallery ?? [],
      services: data.services ?? [],
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
 * Supabase'ga site ma'lumotlarini saqlash (upsert).
 * @param {Object} data
 */
export async function saveLiveCloudState(data) {
  // Avval tab'larni BroadcastChannel orqali xabardor qilish
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SYNC_STATE', payload: data });
    } catch (_) {}
  }

  if (!supabase) return;

  try {
    const { error } = await supabase.from(TABLE).upsert(
      {
        id: ROW_ID,
        orders: data.orders ?? [],
        gallery: data.gallery ?? [],
        services: data.services ?? [],
        reviews: data.reviews ?? [],
        hero_content: data.heroContent ?? {},
        site_info: data.siteInfo ?? {},
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('[liveSync] saveLiveCloudState error:', error.message);
    }
  } catch (err) {
    console.error('[liveSync] saveLiveCloudState exception:', err);
  }
}

/**
 * Supabase Realtime + BroadcastChannel orqali o'zgarishlarni kuzatish.
 * Boshqa qurilma/tab ma'lumot o'zgartirganda callback chaqiriladi.
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

          callback({
            orders: row.orders ?? [],
            gallery: row.gallery ?? [],
            services: row.services ?? [],
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
