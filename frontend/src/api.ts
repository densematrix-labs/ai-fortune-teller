import type { FortuneResult, FortuneStyle } from './types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

// ==================== Fortune API ====================

interface FortunePayload {
  idea: string;
  style: FortuneStyle;
  device_id?: string;
  token?: string;
}

export async function fetchFortune(payload: FortunePayload): Promise<FortuneResult> {
  return request<FortuneResult>('/fortune', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ==================== Trial API ====================

interface TrialStatus {
  has_free_trial: boolean;
  uses_remaining: number;
}

export async function getTrialStatus(deviceId: string): Promise<TrialStatus> {
  return request<TrialStatus>(`/trial-status/${deviceId}`);
}

// ==================== Payment API ====================

interface CreateCheckoutRequest {
  product_sku: string;
  device_id: string;
  optional_email?: string;
  success_url: string;
  cancel_url: string;
}

interface CreateCheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export async function createCheckout(
  req: CreateCheckoutRequest
): Promise<CreateCheckoutResponse> {
  return request<CreateCheckoutResponse>('/payment/create-checkout', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

// ==================== Tokens API ====================

interface TokenInfo {
  token: string;
  remaining_generations: number;
  total_generations: number;
  expires_at: string;
  product_sku: string;
}

interface TokenListResponse {
  tokens: TokenInfo[];
}

export async function getTokensByDevice(deviceId: string): Promise<TokenInfo[]> {
  try {
    const data = await request<TokenListResponse>(`/tokens/by-device/${deviceId}`);
    return data.tokens;
  } catch {
    return [];
  }
}
