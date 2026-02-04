import type { FortuneResult, FortuneStyle } from './types';

export async function fetchFortune(idea: string, style: FortuneStyle): Promise<FortuneResult> {
  const response = await fetch('/api/fortune', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, style }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: '服务器错误' }));
    throw new Error(err.detail || '算命失败，请稍后重试');
  }

  return response.json();
}
