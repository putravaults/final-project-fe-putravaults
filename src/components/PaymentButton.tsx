'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { paymentApi } from '@/lib/api';
import { createPaymentToken, openMidtransSnap, PaymentData } from '@/lib/midtrans';

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

      console.log('Creating booking:', bookingData);
      console.log('userId type:', typeof bookingData.userId);
      console.log('Raw booking data being sent:', JSON.stringify(bookingData, null, 2));
      
      const booking = await paymentApi.createBooking(bookingData, session.accessToken);
      console.log('Booking created:', booking);

      // Step 2: Prepare payment data for Midtrans
      const paymentData: PaymentData = {
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

      console.log('Payment data:', paymentData);

      // Step 3: Create payment token from Midtrans
      const paymentToken = await createPaymentToken(paymentData);
      console.log('Payment token:', paymentToken);

      // Step 4: Open Midtrans Snap popup
      openMidtransSnap(paymentToken);

    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof Error) {
        alert(`Payment failed: ${error.message}`);
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
