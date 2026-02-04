import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import html2canvas from 'html2canvas';
import type { FortuneResult } from '../types';

const FORTUNE_COLORS: Record<string, string> = {
  '上上签': '#ffd700',
  '上吉签': '#ffdf4a',
  '中吉签': '#c084fc',
  '小吉签': '#a78bfa',
  '末吉签': '#94a3b8',
  '凶': '#ef4444',
};

const SCORE_LABELS: Record<string, string> = {
  spread: '传播运',
  funding: '融资运',
  tech: '技术运',
  users: '用户运',
  competition: '竞品运',
};

interface Props {
  result: FortuneResult;
  idea: string;
  onReset: () => void;
}

export default function ResultPage({ result, idea, onReset }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const chartData = Object.entries(result.scores).map(([key, value]) => ({
    subject: SCORE_LABELS[key] || key,
    value,
    fullMark: 100,
  }));

  const fortuneColor = FORTUNE_COLORS[result.fortune_level] || '#c084fc';

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0d0221',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `创业算命-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('生成图片失败，请截图分享');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center px-4 py-8 relative z-10"
    >
      {/* Shareable card */}
      <div
        ref={cardRef}
        className="w-full max-w-lg bg-gradient-to-b from-mystic-700/90 to-mystic-800/90 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-purple-400/20"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-6"
        >
          <p className="text-purple-300/60 text-sm mb-2">🔮 AI 创业算命师</p>
          <h2
            className="text-4xl md:text-5xl font-serif font-bold mb-2"
            style={{ color: fortuneColor }}
          >
            {result.fortune_level}
          </h2>
          <p className="text-purple-300/50 text-sm truncate max-w-xs mx-auto">
            「{idea}」
          </p>
        </motion.div>

        {/* Reading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-gold-400 font-serif text-lg mb-2">📜 运势解读</h3>
          <p className="text-star-100/90 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
            {result.reading}
          </p>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-gold-400 font-serif text-lg mb-2">📊 幸运指数</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(168,85,247,0.2)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#c084fc', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#a78bfa', fontSize: 10 }}
                />
                <Radar
                  name="运势"
                  dataKey="value"
                  stroke="#ffd700"
                  fill="#ffd700"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {/* Score numbers */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {chartData.map((d) => (
              <div key={d.subject} className="text-center">
                <div className="text-gold-400 font-bold text-lg">{d.value}</div>
                <div className="text-purple-300/60 text-xs">{d.subject}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-gold-400 font-serif text-lg mb-3">💡 开运建议</h3>
          <div className="space-y-3">
            {result.advice.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.15 }}
                className="flex gap-3 items-start bg-mystic-600/40 rounded-lg p-3"
              >
                <span className="text-gold-400 font-bold text-lg">{i + 1}</span>
                <p className="text-star-100/80 text-sm">{a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Watermark for shared image */}
        <p className="text-center text-purple-300/30 text-xs mt-6">
          fortune.demo.densematrix.ai · 纯属娱乐
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-300 text-mystic-900 font-bold rounded-full"
        >
          📸 保存分享卡片
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-6 py-3 border border-purple-400/40 text-purple-300 rounded-full hover:bg-purple-400/10"
        >
          🔄 再算一次
        </motion.button>
      </div>
    </motion.div>
  );
}
