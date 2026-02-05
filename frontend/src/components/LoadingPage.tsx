import { motion } from 'framer-motion';
import type { FortuneStyle } from '../types';

const LOADING_TEXTS: Record<FortuneStyle, string[]> = {
  tarot: ['正在洗牌...', '塔罗牌正在排列...', '命运之轮开始转动...', '解读牌面含义...'],
  yijing: ['掐指一算...', '卦象正在生成...', '天机即将显现...', '解读卦辞爻辞...'],
  zodiac: ['查看星象...', '行星正在排列...', '解读你的命运星盘...', '星座能量汇聚...'],
  crystal: ['水晶球开始发光...', '迷雾渐渐散开...', '未来画面浮现...', '灵力感应中...'],
};

const STYLE_EMOJIS: Record<FortuneStyle, string> = {
  tarot: '🃏',
  yijing: '☯️',
  zodiac: '⭐',
  crystal: '🔮',
};

interface Props {
  style: FortuneStyle;
}

export default function LoadingPage({ style }: Props) {
  const texts = LOADING_TEXTS[style];
  const emoji = STYLE_EMOJIS[style];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10"
    >
      {/* Animated emoji */}
      <motion.div
        className="text-8xl mb-8"
        animate={{
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.1, 1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {emoji}
      </motion.div>

      {/* Spinning ring */}
      <div className="relative w-32 h-32 mb-8">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-gold-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-purple-400/40 border-t-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-gold-400/50 border-b-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-4 h-4 rounded-full bg-gold-400"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Loading text sequence */}
      <div className="h-8">
        {texts.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
            transition={{
              duration: 2,
              delay: i * 1.2,
              repeat: Infinity,
              repeatDelay: (texts.length - 1) * 1.2,
            }}
            className="text-purple-300 text-lg font-serif absolute left-1/2 -translate-x-1/2"
          >
            {text}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
