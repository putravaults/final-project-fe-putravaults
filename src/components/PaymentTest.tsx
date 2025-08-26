'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { paymentApi } from '@/lib/api';

export default function PaymentTest() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testPayment = async () => {
    if (!session?.accessToken) {
      setResult('No session found');
      return;
    }

    setLoading(true);
    setResult('Testing payment...');

    try {
      const testData = {
        orderId: `TEST-${Date.now()}`,
        amount: 100000, // 1000 IDR
        customerName: session.user?.name || 'Test Customer',
        customerEmail: session.user?.email || 'test@example.com',
        itemDetails: [
          {
            id: '1',
            price: 100000,
            quantity: 1,
            name: 'Test Ticket',
          },
        ],
      };

      const response = await paymentApi.createPayment(testData, session.accessToken);
      setResult(`Success! Token: ${response.token ? response.token.substring(0, 20) + '...' : 'No token'}`);
      
      // Test if snap is available
      if (response.token && typeof window.snap !== 'undefined') {
        setResult(prev => prev + ' - Snap available, testing popup...');
        setTimeout(() => {
          window.snap.pay(response.token, {
            onSuccess: (result: any) => {
              setResult('Test payment popup opened successfully!');
            },
            onError: (result: any) => {
              setResult('Test payment popup error: ' + JSON.stringify(result));
            },
            onClose: () => {
              setResult('Test payment popup closed');
            }
          });
        }, 1000);
      } else if (response.token) {
        setResult(prev => prev + ' - Snap not available, token received');
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Payment Test</h3>
      <button
        onClick={testPayment}
        disabled={loading}
        className="bg-white text-blue-600 px-2 py-1 rounded text-xs mb-2 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Payment'}
      </button>
      <div className="text-xs break-all">{result}</div>
    </div>
  );
}
