import crypto from 'crypto';

const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET || 'super-secret-key-for-local';
const SUN_BACKEND_URL = process.env.SUN_BACKEND_URL || 'http://localhost:4000';

/**
 * Sends a secure POST request to the Sun Backend using HMAC signature.
 */
export async function sendToSunBackend(endpoint: string, payload: any) {
  const payloadString = JSON.stringify(payload);
  
  const signature = crypto
    .createHmac('sha256', INTERNAL_SERVICE_SECRET)
    .update(payloadString)
    .digest('hex');

  const response = await fetch(`${SUN_BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-signature': signature,
    },
    body: payloadString,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sun Backend error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
