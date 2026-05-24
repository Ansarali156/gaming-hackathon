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
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

export async function forwardToSun(payload: Payload) {
  const endpoint = process.env.SUN_ENDPOINT_URL || 'http://localhost/sun/public/gaminghackathon/create-order.php';
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
