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
  const endpoint = process.env.SUN_ENDPOINT_URL || "http://localhost/sun/public/gaminghackathon/create-order.php";
  const body = makeSunPayload(payload);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`SUN forward failed: ${res.status} ${res.statusText} ${txt}`);
  }

  return true;
}

export function makeSunPayload(payload: Payload) {
  return {
    data: JSON.stringify(payload),
    timestamp: Math.floor(Date.now() / 1000),
    sender: "sun",
  };
}

export function makeSunRedirectUrl(payload: Payload) {
  const url = new URL(
    process.env.SUN_ENDPOINT_URL || "http://localhost/sun/public/gaminghackathon/create-order.php"
  );
  const body = makeSunPayload(payload);

  Object.entries(body).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export function decryptSunPayload(params: {
  data: string;
  timestamp: string;
  sender: string;
}) {
  try {
    return JSON.parse(params.data);
  } catch {
    const decoded = Buffer.from(params.data, "base64").toString("utf8");
    return JSON.parse(decoded);
  }
}
