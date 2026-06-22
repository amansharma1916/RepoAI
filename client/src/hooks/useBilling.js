import { useCallback, useEffect, useState } from 'react';
import {
  createPaymentOrder,
  getPlanStatus,
  loadRazorpayScript,
  verifyPayment,
} from '../services/billingService';
import { getApiErrorMessage } from '../services/dashboardService';

export function useBilling() {
  const [planStatus, setPlanStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const refreshPlan = useCallback(async () => {
    try {
      const data = await getPlanStatus();
      setPlanStatus(data);
      return data;
    } catch (err) {
      console.error('Failed to load plan status', err);
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await getPlanStatus();
        if (!cancelled) {
          setPlanStatus(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load plan status', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const startCheckout = useCallback(async () => {
    setError('');
    setSuccessMessage('');
    setCheckoutLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay checkout. Please try again.');
      }

      const order = await createPaymentOrder();
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!key) {
        throw new Error('Payment gateway is not configured.');
      }

      const user = (() => {
        try {
          const stored = localStorage.getItem('user');
          return stored ? JSON.parse(stored) : null;
        } catch {
          return null;
        }
      })();

      await new Promise((resolve, reject) => {
        const options = {
          key,
          amount: order.amount,
          currency: order.currency,
          name: 'RepoAI',
          description: 'RepoAI Pro',
          order_id: order.order_id,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#00d4ff',
          },
          handler: async (response) => {
            try {
              const result = await verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (result.plan) {
                setPlanStatus(result.plan);
              } else {
                await refreshPlan();
              }

              setSuccessMessage('Payment successful! Welcome to RepoAI Pro.');
              resolve();
            } catch (verifyError) {
              reject(verifyError);
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled.'));
            },
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on('payment.failed', (response) => {
          reject(
            new Error(
              response?.error?.description || 'Payment failed. Please try again.',
            ),
          );
        });

        razorpay.open();
      });
    } catch (err) {
      const message = getApiErrorMessage(err, err.message || 'Checkout failed.');
      if (message !== 'Payment cancelled.') {
        setError(message);
      }
    } finally {
      setCheckoutLoading(false);
    }
  }, [refreshPlan]);

  return {
    planStatus,
    loading,
    checkoutLoading,
    error,
    successMessage,
    setError,
    setSuccessMessage,
    refreshPlan,
    startCheckout,
  };
}
