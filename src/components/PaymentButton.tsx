'use client'

declare global {
  interface Window {
    snap: any;
  }
}

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { paymentApi } from '@/lib/api';

interface PaymentButtonProps {
  eventId: number;
  ticketClassId: number;
  ticketClassName: string;
  price: number;
  quantity: number;
  eventName: string;
}

export default function PaymentButton({
  eventId,
  ticketClassId,
  ticketClassName,
  price,
  quantity,
  eventName,
}: PaymentButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!session?.accessToken || !session?.user?.email || !session?.user?.id) {
      alert('Please login to purchase tickets');
      return;
    }

    // Check if Midtrans client key is configured
    if (!process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY) {
      console.error('Midtrans client key not configured');
      alert('Payment service is not properly configured. Please contact support.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Prepare booking data (will be created after payment confirmation)
      const bookingData = {
        userId: parseInt(session.user.id.toString()),
        tickets: [
          {
            ticketClassId: ticketClassId,
            quantity: quantity
          }
        ]
      };

      // Step 2: Prepare payment data for backend (orderId will be generated on backend)
      const totalAmount = price * quantity;
      const itemName = `${eventName} - ${ticketClassName}`;
      
      // Truncate item name to fit Midtrans requirements (max 50 characters)
      const truncatedItemName = itemName.length > 50 ? itemName.substring(0, 47) + '...' : itemName;
      
      const paymentData = {
        amount: totalAmount,
        customerName: session.user.name || 'Customer',
        customerEmail: session.user.email,
        itemDetails: [
          {
            id: ticketClassId.toString(),
            price: price,
            quantity: quantity,
            name: truncatedItemName,
          },
        ],
      };

      // Step 3: Create payment with booking data (booking will be created after payment confirmation)
      const paymentResponse = await paymentApi.createPaymentWithBooking(paymentData, bookingData, session.accessToken)

      if (paymentResponse && paymentResponse.token) {
        // Step 4: Check if Midtrans script is loaded
        if (typeof window.snap === 'undefined') {
          console.error('Midtrans Snap script not loaded');
          alert('Payment service is not ready. Please refresh the page and try again.');
          return;
        }

        // Step 5: Open Midtrans Snap popup
        window.snap.pay(paymentResponse.token, {
                      onSuccess: (result: { order_id: string }) => {
              window.location.href = `/payment/success?order_id=${result.order_id}`;
            },
            onPending: (result: { order_id: string }) => {
              window.location.href = `/payment/pending?order_id=${result.order_id}`;
            },
            onError: (result: { order_id: string }) => {
              window.location.href = `/payment/error?order_id=${result.order_id}`;
            },
            onClose: () => {
              alert('Payment was cancelled');
            },
        });
              } else {
          alert('Failed to initialize payment. Please try again.');
        }

    } catch (error) {
      if (error instanceof Error) {
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          alert('Network error: Unable to connect to payment service. Please check your internet connection and try again.');
        } else if (error.message.includes('401') || error.message.includes('403')) {
          alert('Authentication error: Please login again and try the payment.');
        } else if (error.message.includes('500')) {
          alert('Server error: Payment service is temporarily unavailable. Please try again later.');
        } else {
          alert(`Payment failed: ${error.message}`);
        }
      } else {
        alert('Failed to process payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Processing...' : `Pay Rp ${(price * quantity).toLocaleString()}`}
    </button>
  );
}
