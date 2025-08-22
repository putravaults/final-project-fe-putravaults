'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { paymentApi } from '@/lib/api';
import Link from 'next/link';

interface PaymentStatus {
  transaction_status: string;
  fraud_status: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
}

export default function PaymentStatusPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPaymentStatus = async () => {
    if (!orderId || !session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const result = await paymentApi.checkPaymentStatus(orderId, session.accessToken);
      setPaymentStatus(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check payment status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && session?.accessToken) {
      checkPaymentStatus();
    }
  }, [orderId, session?.accessToken]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settlement':
      case 'capture':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'deny':
      case 'expire':
      case 'cancel':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'settlement':
      case 'capture':
        return 'Payment Successful';
      case 'pending':
        return 'Payment Pending';
      case 'deny':
        return 'Payment Denied';
      case 'expire':
        return 'Payment Expired';
      case 'cancel':
        return 'Payment Cancelled';
      default:
        return status;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Status</h1>
          <p className="text-gray-600">Please login to check your payment status.</p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Status</h1>
          <p className="text-gray-600">No order ID provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Status</h1>
            <div className="flex items-center space-x-3">
              <Link
                href="/my-tickets"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                My Tickets
              </Link>
              <button
                onClick={checkPaymentStatus}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Refresh'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {paymentStatus ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order ID</label>
                  <p className="mt-1 text-sm text-gray-900">{paymentStatus.order_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-gray-900">Rp {parseInt(paymentStatus.gross_amount).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                  <p className="mt-1 text-sm text-gray-900">{paymentStatus.payment_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction Time</label>
                  <p className="mt-1 text-sm text-gray-900">{paymentStatus.transaction_time}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(paymentStatus.transaction_status)}`}>
                  {getStatusText(paymentStatus.transaction_status)}
                </span>
              </div>

              {paymentStatus.va_numbers && paymentStatus.va_numbers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Virtual Account Numbers</label>
                  <div className="mt-2 space-y-2">
                    {paymentStatus.va_numbers.map((va, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{va.bank.toUpperCase()}</p>
                        <p className="text-lg font-mono text-gray-700">{va.va_number}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentStatus.transaction_status === 'pending' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-800">Payment Instructions</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Please complete your bank transfer within 24 hours. The payment will expire automatically if not completed.
                  </p>
                </div>
              )}

              {paymentStatus.transaction_status === 'settlement' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Payment Successful!</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Your payment has been confirmed. You will receive your tickets shortly.
                  </p>
                </div>
              )}
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Checking payment status...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No payment information available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
