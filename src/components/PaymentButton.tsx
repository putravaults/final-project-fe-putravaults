// @ts-nocheck
'use client'

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
    if (!session?.accessToken || !session?.user) {
      alert('Please login to purchase tickets');
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
      const paymentResult = await paymentApi.createPayment(paymentData, session.accessToken);
      console.log('Payment result from backend:', paymentResult);

      // Step 4: Handle payment result
      if (paymentResult.success) {
        if (paymentResult.redirect_url) {
          // Open bank transfer page in new window
          window.open(paymentResult.redirect_url, '_blank', 'width=600,height=600');
          // Redirect to payment status page
          window.location.href = `/payment/status?order_id=${paymentResult.order_id}`;
        } else if (paymentResult.va_numbers && paymentResult.va_numbers.length > 0) {
          // Show virtual account numbers
          const vaInfo = paymentResult.va_numbers.map((va: { bank: string; va_number: string }) => 
            `${va.bank.toUpperCase()}: ${va.va_number}`
          ).join('\n');
          alert(`Please transfer to:\n${vaInfo}\n\nOrder ID: ${paymentResult.order_id}\n\nYou will be redirected to your tickets page.`);
          // Redirect to payment status page
          window.location.href = `/payment/status?order_id=${paymentResult.order_id}`;
        } else {
          alert('Payment created successfully. You will be redirected to your tickets page.');
          // Redirect to payment status page
          window.location.href = `/payment/status?order_id=${paymentResult.order_id}`;
        }
      } else {
        throw new Error('Payment creation failed');
      }

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
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Processing...' : `Pay Rp ${(price * quantity).toLocaleString()}`}
    </button>
  );
}
