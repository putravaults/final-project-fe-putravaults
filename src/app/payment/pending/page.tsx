'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IoTime, IoHome, IoReceipt } from 'react-icons/io5';

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    console.log('Payment pending for order:', orderId);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Pending Icon */}
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <IoTime className="w-8 h-8 text-yellow-600" />
        </div>

        {/* Pending Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Pending
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment is being processed. Please complete the payment to confirm your tickets.
        </p>

        {/* Order Details */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono text-sm text-gray-900">{orderId}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">What to do next:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Complete your bank transfer</li>
            <li>• Wait for payment confirmation</li>
            <li>• Check your email for updates</li>
            <li>• Your tickets will be confirmed once payment is received</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/mytickets"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <IoReceipt className="w-5 h-5" />
            Check My Bookings
          </Link>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <IoHome className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Payment processing may take up to 24 hours. 
            You will receive an email once payment is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}
