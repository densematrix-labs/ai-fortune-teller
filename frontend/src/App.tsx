import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import InputPage from './components/InputPage';
import LoadingPage from './components/LoadingPage';
import ResultPage from './components/ResultPage';
import { fetchFortune } from './api';
import type { FortuneResult, FortuneStyle } from './types';

type Page = 'input' | 'loading' | 'result';

export default function App() {
  const [page, setPage] = useState<Page>('input');
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState<FortuneStyle>('tarot');
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (inputIdea: string, inputStyle: FortuneStyle) => {
    setIdea(inputIdea);
    setStyle(inputStyle);
    setPage('loading');
    setError('');

    try {
      const data = await fetchFortune(inputIdea, inputStyle);
      setResult(data);
      // Minimum loading time for ritual feel
      await new Promise((r) => setTimeout(r, 2000));
      setPage('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '算命失败');
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
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
          <button onClick={() => setError('')} className="ml-3 font-bold">
            ✕
          </button>
        </div>
      )}
      <AnimatePresence mode="wait">
        {page === 'input' && <InputPage key="input" onSubmit={handleSubmit} />}
        {page === 'loading' && <LoadingPage key="loading" style={style} />}
        {page === 'result' && result && (
          <ResultPage key="result" result={result} idea={idea} onReset={handleReset} />
        )}
      </AnimatePresence>
    </>
  );
}
