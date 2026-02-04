import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import InputPage from './components/InputPage';
import LoadingPage from './components/LoadingPage';
import ResultPage from './components/ResultPage';
import { fetchFortune, getTrialStatus } from './api';
import { useTokenStore } from './stores/tokenStore';
import { getDeviceId } from './lib/fingerprint';
import type { FortuneResult, FortuneStyle } from './types';

type Page = 'input' | 'loading' | 'result';

export default function App() {
  const [page, setPage] = useState<Page>('input');
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState<FortuneStyle>('tarot');
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [hasFreeTrial, setHasFreeTrial] = useState<boolean | null>(null);

  const { getActiveToken, getTotalGenerations, updateTokenUsage } = useTokenStore();
  const activeToken = getActiveToken();
  const totalCredits = getTotalGenerations();

  // Initialize device ID and check trial status
  useEffect(() => {
    async function init() {
      const id = await getDeviceId();
      setDeviceId(id);
      try {
        const status = await getTrialStatus(id);
        setHasFreeTrial(status.has_free_trial);
      } catch {
        // If API fails, assume trial available
        setHasFreeTrial(true);
      }
    }
    init();
  }, []);

  const canUse = hasFreeTrial || totalCredits > 0;

  const handleSubmit = async (inputIdea: string, inputStyle: FortuneStyle) => {
    if (!deviceId) return;

    setIdea(inputIdea);
    setStyle(inputStyle);
    setPage('loading');
    setError('');

    try {
      // Build payload with auth
      const payload: {
        idea: string;
        style: FortuneStyle;
        device_id?: string;
        token?: string;
      } = {
        idea: inputIdea,
        style: inputStyle,
      };

      if (activeToken) {
        payload.token = activeToken.token;
      } else {
        payload.device_id = deviceId;
      }

      const data = await fetchFortune(payload);
      setResult(data);

      // Update local state after successful use
      if (activeToken) {
        updateTokenUsage(activeToken.token, activeToken.remaining_generations - 1);
      } else {
        setHasFreeTrial(false);
      }

      // Minimum loading time for ritual feel
      await new Promise((r) => setTimeout(r, 2000));
      setPage('result');
    } catch (err) {
      const message = err instanceof Error ? err.message : '算命失败';
      if (message.includes('402') || message.includes('免费试用') || message.includes('Token')) {
        setError('免费次数已用完，请购买算命次数继续使用');
        setHasFreeTrial(false);
      } else {
        setError(message);
      }
      setPage('input');
    }
  };

  const handleReset = () => {
    setPage('input');
    setResult(null);
    setIdea('');
    setError('');
  };

  return (
    <>
      <div className="starfield" />

      {/* Credits bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {totalCredits > 0 ? (
          <span className="text-gold-400 text-sm bg-mystic-700/80 px-3 py-1.5 rounded-lg border border-gold-400/30 backdrop-blur-sm">
            ✨ 剩余 {totalCredits} 次
          </span>
        ) : hasFreeTrial ? (
          <span className="text-green-400 text-sm bg-mystic-700/80 px-3 py-1.5 rounded-lg border border-green-400/30 backdrop-blur-sm">
            🎁 免费试用 1 次
          </span>
        ) : (
          <span className="text-red-400 text-sm bg-mystic-700/80 px-3 py-1.5 rounded-lg border border-red-400/30 backdrop-blur-sm">
            次数已用完
          </span>
        )}
        <Link
          to="/pricing"
          className="text-purple-300 text-sm bg-mystic-700/80 px-3 py-1.5 rounded-lg border border-purple-400/30 hover:border-purple-400/60 backdrop-blur-sm transition-colors"
        >
          💰 购买次数
        </Link>
      </div>

      {error && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
          <button onClick={() => setError('')} className="ml-3 font-bold">
            ✕
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {page === 'input' && (
          <InputPage key="input" onSubmit={handleSubmit} canUse={canUse} />
        )}
        {page === 'loading' && <LoadingPage key="loading" style={style} />}
        {page === 'result' && result && (
          <ResultPage key="result" result={result} idea={idea} onReset={handleReset} />
        )}
      </AnimatePresence>
    </>
  );
}
