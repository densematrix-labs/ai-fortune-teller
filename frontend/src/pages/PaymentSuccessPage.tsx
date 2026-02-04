/**
 * Payment Success Page — Shows after Creem checkout redirect.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTokenStore } from '../stores/tokenStore';
import { getTokensByDevice } from '../api';
import { getDeviceId } from '../lib/fingerprint';

export default function PaymentSuccessPage() {
  const { addToken, tokens } = useTokenStore();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const deviceId = await getDeviceId();
        const serverTokens = await getTokensByDevice(deviceId);

        for (const serverToken of serverTokens) {
          const exists = tokens.some((t) => t.token === serverToken.token);
          if (!exists) {
            addToken({
              token: serverToken.token,
              remaining_generations: serverToken.remaining_generations,
              expires_at: serverToken.expires_at,
            });
            setToken(serverToken.token);
          }
        }

        if (!token && serverTokens.length > 0) {
          setToken(serverTokens[0].token);
        }
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTokens();
  }, [addToken, tokens]);

  const handleCopy = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncate = (t: string) =>
    t.length > 24 ? `${t.slice(0, 12)}...${t.slice(-12)}` : t;

  return (
    <>
      <div className="starfield" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <span className="text-4xl">✅</span>
        </motion.div>

        <h1 className="text-3xl font-serif text-gold-400 mb-2">支付成功！</h1>
        <p className="text-purple-300 mb-8">算命次数已添加到你的账户</p>

        {loading ? (
          <div className="bg-mystic-700/80 border border-purple-400/20 rounded-xl p-6 mb-8 text-center">
            <p className="text-purple-300/60">正在加载 Token...</p>
          </div>
        ) : token ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-mystic-700/80 border border-purple-400/20 rounded-xl p-6 mb-8 text-center max-w-md w-full"
          >
            <p className="text-purple-300/50 text-xs uppercase tracking-wider mb-3">
              你的 Token（请妥善保管）
            </p>
            <div className="flex items-center justify-center gap-2 bg-mystic-800/80 rounded-lg p-3 mb-2">
              <code className="text-gold-400 text-sm font-mono">{truncate(token)}</code>
              <button
                onClick={handleCopy}
                className="text-purple-300/60 hover:text-purple-300 text-xs border border-purple-400/20 px-2 py-1 rounded transition-colors"
              >
                {copied ? '已复制!' : '复制'}
              </button>
            </div>
            <p className="text-purple-300/40 text-xs">
              可用此 Token 在其他设备上恢复算命次数
            </p>
          </motion.div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-400 to-gold-400 text-mystic-900 font-bold rounded-full"
            >
              🔮 开始算命
            </motion.button>
          </Link>
          <Link to="/pricing">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-purple-400/40 text-purple-300 rounded-full hover:bg-purple-400/10 transition-colors"
            >
              购买更多
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
