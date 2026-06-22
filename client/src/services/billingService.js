import serverClient from '../apiClient/serverClient';

export async function getPlanStatus() {
  const response = await serverClient.get('/plan');
  return response.data;
}

export async function createPaymentOrder() {
  const response = await serverClient.post('/create-order');
  return response.data;
}

export async function verifyPayment(payload) {
  const response = await serverClient.post('/verify-payment', payload);
  return response.data;
}

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
