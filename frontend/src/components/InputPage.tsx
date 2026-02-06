import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { FortuneStyle } from '../types';

const STYLE_ICONS: Record<FortuneStyle, string> = {
  tarot: '🃏',
  yijing: '☯️',
  zodiac: '⭐',
  crystal: '🔮',
};

const STYLE_IDS: FortuneStyle[] = ['tarot', 'yijing', 'zodiac', 'crystal'];

interface Props {
  onSubmit: (idea: string, style: FortuneStyle) => void;
  canUse?: boolean;
}

export default function InputPage({ onSubmit, canUse = true }: Props) {
  const { t } = useTranslation();
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState<FortuneStyle>('tarot');

  const handleSubmit = () => {
    if (idea.trim()) {
      onSubmit(idea.trim(), style);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10"
    >
      {/* Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-serif text-gold-400 mb-3 float-animation">
          🔮 {t('title')}
        </h1>
        <p className="text-purple-300 text-lg md:text-xl">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xl"
      >
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="w-full h-32 p-4 rounded-xl bg-mystic-700/80 border border-purple-400/30 text-white placeholder-purple-300/50 focus:outline-none focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/20 resize-none text-lg backdrop-blur-sm"
          maxLength={2000}
        />
        <div className="text-right text-purple-300/50 text-sm mt-1">
          {t('charCount', { count: idea.length })}
        </div>
      </motion.div>

      {/* Style Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 w-full max-w-xl"
      >
        {STYLE_IDS.map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`p-3 rounded-xl border transition-all duration-300 text-center ${
              style === s
                ? 'border-gold-400 bg-mystic-600/80 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                : 'border-purple-400/20 bg-mystic-700/50 hover:border-purple-400/50'
            }`}
          >
            <div className="text-2xl mb-1">{STYLE_ICONS[s]}</div>
            <div className="text-sm font-medium text-white">{t(`styles.${s}.name`)}</div>
            <div className="text-xs text-purple-300/60 mt-0.5">{t(`styles.${s}.description`)}</div>
          </button>
        ))}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={!idea.trim() || !canUse}
        className="mt-8 px-10 py-4 bg-gradient-to-r from-purple-400 to-gold-400 text-mystic-900 font-bold text-xl rounded-full disabled:opacity-40 disabled:cursor-not-allowed pulse-glow transition-all duration-300"
      >
        {canUse ? t('startFortune') : t('noCredits')}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-purple-300/40 text-sm"
      >
        ✨ {t('disclaimer')} ✨
      </motion.p>
    </motion.div>
  );
}
