// Local Multi-Tab Sync Service (No Supabase)

const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('tozalik_ustasi_channel') : null;

export async function fetchLiveCloudState() {
  return null;
}

export async function saveLiveCloudState(data) {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SYNC_STATE', payload: data });
    } catch (e) {}
  }
}

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

  return () => {
    unsubscribes.forEach(fn => fn());
  };
}
