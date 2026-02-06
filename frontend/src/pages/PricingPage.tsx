/**
 * Pricing Page — Fortune telling credits purchase.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { createCheckout } from '../api';
import { getDeviceId } from '../lib/fingerprint';

const products = [
  {
    sku: 'fortune_pack_3',
    generations: 3,
    price_cents: 799,
    popular: true,
  },
  {
    sku: 'fortune_pack_10',
    generations: 10,
    price_cents: 1999,
    discount_percent: 25,
    popular: false,
  },
];

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function PricingPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const features = [
    `🃏 ${t('pricing.features.styles')}`,
    `📊 ${t('pricing.features.radar')}`,
    `💡 ${t('pricing.features.advice')}`,
    `📸 ${t('pricing.features.share')}`,
  ];

  const handlePurchase = async (sku: string) => {
    setLoading(sku);
    setError('');
    try {
      const deviceId = await getDeviceId();
      const response = await createCheckout({
        product_sku: sku,
        device_id: deviceId,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/pricing`,
      });
      window.location.href = response.checkout_url;
    } catch {
      setError(t('pricing.paymentError'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="starfield" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center px-4 py-8 relative z-10"
      >
        {/* Back nav */}
        <div className="w-full max-w-2xl mb-6">
          <Link to="/" className="text-purple-300/60 hover:text-purple-300 text-sm transition-colors">
            {t('pricing.backHome')}
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-serif text-gold-400 mb-3">
            ✨ {t('pricing.title')}
          </h1>
          <p className="text-purple-300 text-lg">{t('pricing.subtitle')}</p>
          <p className="text-purple-300/40 text-sm mt-2 bg-mystic-700/50 inline-block px-3 py-1 rounded-lg">
            🎁 {t('pricing.freeTrialNote')}
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-2 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product.sku}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              className={`relative bg-gradient-to-b from-mystic-700/80 to-mystic-800/80 rounded-2xl p-6 border backdrop-blur-sm ${
                product.popular
                  ? 'border-gold-400/50 shadow-[0_0_20px_rgba(255,215,0,0.15)]'
                  : 'border-purple-400/20 hover:border-purple-400/40'
              } transition-all duration-300`}
            >
              {product.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-mystic-900 text-xs font-bold px-3 py-1 rounded-full">
                  {t('pricing.popular')}
                </span>
              )}

              <h2 className="text-xl font-serif text-white text-center mb-2">
                {t(`pricing.products.${product.sku}`)}
              </h2>

              <div className="text-center mb-1">
                <span className="text-4xl font-bold text-gold-400">
                  {formatCurrency(product.price_cents)}
                </span>
                {product.discount_percent && (
                  <span className="ml-2 text-sm text-green-400 font-medium">
                    {t('pricing.save')} {product.discount_percent}%
                  </span>
                )}
              </div>

              <p className="text-center text-purple-300/50 text-sm mb-4">
                {formatCurrency(Math.round(product.price_cents / product.generations))} {t('pricing.perSession')}
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-300 mb-4 ${
                  product.popular
                    ? 'bg-gradient-to-r from-purple-400 to-gold-400 text-mystic-900'
                    : 'border border-purple-400/40 text-purple-300 hover:bg-purple-400/10'
                }`}
                disabled={loading !== null}
                onClick={() => handlePurchase(product.sku)}
              >
                {loading === product.sku ? t('pricing.processing') : t('pricing.buyNow')}
              </motion.button>

              <div className="space-y-2">
                {features.map((feature, i) => (
                  <div key={i} className="text-sm text-purple-300/60">
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-purple-300/30 text-xs">
          {t('pricing.securePayment')}
        </p>
      </motion.div>
    </>
  );
}
