import crypto from 'crypto';

type Payload = {
  id: string;
  email: string | null;
  name: string | null;
  mobile: string | null;
  amount: number;
  gst: number;
  finalAmount: number;
};

function getAesKey(): Buffer {
  const sharedKey = process.env.SUN_SHARED_KEY;
  if (!sharedKey) throw new Error('SUN_SHARED_KEY not configured in env');
  if (/^[0-9a-f]{64}$/i.test(sharedKey)) {
    return Buffer.from(sharedKey, 'hex');
  }
  return crypto.createHash('sha256').update(sharedKey).digest();
}

export async function forwardToSun(payload: Payload) {
  const endpoint = process.env.SUN_ENDPOINT_URL || 'http://localhost/sun/public/gaminghackathon/create-order.php';

  const key = getAesKey();
  const iv = crypto.randomBytes(12);

  const plaintext = JSON.stringify(payload);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const mac = crypto.createHmac('sha256', key).update(Buffer.concat([iv, ciphertext, tag])).digest();

  const body = makeSunPayloadFromParts(iv, ciphertext, tag, mac);

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
  const key = getAesKey();
  const iv = crypto.randomBytes(12);

  const plaintext = JSON.stringify(payload);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const mac = crypto.createHmac('sha256', key).update(Buffer.concat([iv, ciphertext, tag])).digest();

  return makeSunPayloadFromParts(iv, ciphertext, tag, mac);
}

function makeSunPayloadFromParts(iv: Buffer, ciphertext: Buffer, tag: Buffer, mac: Buffer) {
  return {
    data: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    mac: mac.toString('base64'),
    // PHP receiver compares against seconds (time()), so send UNIX seconds
    timestamp: Math.floor(Date.now() / 1000),
    sender: 'gaming-hackathon',
  };
}
