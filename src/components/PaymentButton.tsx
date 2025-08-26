'use client'

declare global {
  interface Window {
    snap: any;
  }
}

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
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
  const [snapLoaded, setSnapLoaded] = useState(false);

  const handlePayment = async () => {
    if (!session?.accessToken || !session?.user?.email || !session?.user?.id) {
      alert('Please login to purchase tickets');
      return;
    }

    if (!snapLoaded) {
      alert('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);

    try {
      console.log('=== Starting Payment Process ===');
      console.log('Session user:', session.user);
      console.log('Event details:', { eventId, eventName, ticketClassId, ticketClassName, price, quantity });

      // Step 1: Create booking directly with ticket class ID and quantity
      const bookingData = {
        userId: parseInt(session.user.id.toString()),
        tickets: [
          {
            ticketClassId: ticketClassId,
            quantity: quantity
          }
        ]
      };

      console.log('Creating booking with data:', bookingData);
      
      const booking = await paymentApi.createBooking(bookingData, session.accessToken);
      console.log('Booking created successfully:', booking);

      // Step 2: Prepare payment data for backend
      const paymentData = {
        orderId: `ORDER-${booking.id}`, // Use booking ID for order ID
        amount: price * quantity,
        customerName: session.user.name || 'Customer',
        customerEmail: session.user.email,
        itemDetails: [
          {
            id: ticketClassId.toString(),
            price: price,
            quantity: quantity,
            name: `${eventName} - ${ticketClassName}`,
          },
        ],
      };

      console.log('Prepared payment data for backend:', paymentData);

      // Step 3: Create payment through backend (avoids CORS issues)
      console.log('Calling backend payment endpoint...');
      const {token} = await paymentApi.createPayment(paymentData, session.accessToken)

      if(token){
        // Step 4: Open Midtrans Snap popup
        console.log('Opening Midtrans Snap popup with token:', token);
        window.snap.pay(token) 
        //we dont need these yet
        // {
        //   onSuccess: (result: { order_id: string }) => {
        //     console.log('Payment success:', result);
        //     window.location.href = `/payment/success?order_id=${result.order_id}`;
        //   },
        //   onPending: (result: { order_id: string }) => {
        //     console.log('Payment pending:', result);
        //     window.location.href = `/payment/pending?order_id=${result.order_id}`;
        //   },
        //   onError: (result: { order_id: string }) => {
        //     console.log('Payment error:', result);
        //     window.location.href = `/payment/error?order_id=${result.order_id}`;
        //   },
        //   onClose: () => {
        //     console.log('Payment popup closed');
        //     alert('Payment was cancelled');
        //   },
        // });
      }
      console.log('Payment result from backend:', token);

    } catch (error) {
      console.error('=== Payment Error Details ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : error);
      console.error('Full error object:', error);
      
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
    <>
      {/* Load Midtrans Snap Script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      
      <button
        onClick={handlePayment}
        disabled={loading || !snapLoaded}
        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : !snapLoaded ? 'Loading...' : `Pay Rp ${(price * quantity).toLocaleString()}`}
      </button>
    </>
  );
}
