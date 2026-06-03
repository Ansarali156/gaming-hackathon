import crypto from "crypto";

type Payload = {
  id: string;
  email: string | null;
  name: string | null;
  mobile: string | null;
  category?: string;
  teamSize?: number;
  baseAmount?: number;
  amount: number;
  gst: number;
  finalAmount: number;
};

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

export function makeSunPayload(payload: Payload) {
  const normalizedAmount =
    toFiniteNumber((payload as any).amount) ??
    toFiniteNumber((payload as any).baseAmount) ??
    toFiniteNumber((payload as any).finalAmount);

  const normalizedGst =
    toFiniteNumber((payload as any).gst) ??
    ((normalizedAmount ?? 0) * 0.02);

  const normalizedFinalAmount =
    toFiniteNumber((payload as any).finalAmount) ??
    ((normalizedAmount ?? 0) + normalizedGst);

  const normalizedTeamSize =
    toFiniteNumber((payload as any).teamSize) ??
    toFiniteNumber((payload as any).team_size);

  return {
    ...payload,
    teamSize: normalizedTeamSize,
    team_size: normalizedTeamSize,
    baseAmount: normalizedAmount,
    base_amount: normalizedAmount,
    amount: normalizedAmount,
    gst: normalizedGst,
    finalAmount: normalizedFinalAmount,
    final_amount: normalizedFinalAmount,
  };
}

export function encryptPayload(payload: any) {
  const sharedKey = process.env.SUN_SHARED_KEY;
  if (!sharedKey) {
    throw new Error("SUN_SHARED_KEY is not configured in the environment variables.");
  }

  const key = crypto.createHash("sha256").update(sharedKey).digest();
  const iv = crypto.randomBytes(12);
  const plaintext = JSON.stringify(payload);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  const mac = crypto.createHmac("sha256", key)
    .update(Buffer.concat([iv, ciphertext, tag]))
    .digest();

  return {
    data: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    mac: mac.toString("base64"),
    timestamp: Math.floor(Date.now() / 1000).toString(),
    sender: "incuxai"
  };
}

export async function forwardToSun(payload: Payload) {
  const endpoint = process.env.SUN_ENDPOINT_URL || "http://localhost/sun/public/gaminghackathon/create-order.php";
  const body = makeSunPayload(payload);
  const encrypted = encryptPayload(body);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(encrypted),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`SUN forward failed: ${res.status} ${res.statusText} ${txt}`);
  }

  return true;
}

export function makeSunRedirectUrl(payload: Payload) {
  const endpoint = process.env.SUN_ENDPOINT_URL || "http://localhost/sun/public/gaminghackathon/create-order.php";
  const url = new URL(endpoint);
  
  const body = makeSunPayload(payload);
  const encrypted = encryptPayload(body);

  Object.entries(encrypted).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}
