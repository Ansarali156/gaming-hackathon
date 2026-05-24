type Payload = {
  id: string;
  email: string | null;
  name: string | null;
  mobile: string | null;
  amount: number;
  gst: number;
  finalAmount: number;
};

export async function forwardToSun(payload: Payload) {
  const endpoint = process.env.SUN_ENDPOINT_URL || 'http://localhost/sun/public/gaminghackathon/create-order.php';
  const sharedKey = process.env.SUN_SHARED_KEY;
  if (!sharedKey) throw new Error('SUN_SHARED_KEY not configured in env');
  const body = makeSunPayload(payload);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`SUN forward failed: ${res.status} ${res.statusText} ${txt}`);
  }

  return true;
}

export function makeSunPayload(payload: Payload) {
  return {
    data: JSON.stringify(payload),
    timestamp: Math.floor(Date.now() / 1000),
    sender: 'gaming-hackathon',
  };
}
