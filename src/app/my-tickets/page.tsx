// @ts-nocheck
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { paymentApi } from '@/lib/api';
import Link from 'next/link';

interface Ticket {
  id: number;
  seatNumber: string;
  status: string;
  ticketClass: {
    id: number;
    name: string;
    description: string;
    price: number;
  };
  event: {
    id: number;
    name: string;
    description: string;
    date: string;
    venue: string;
    image: string;
  };
}

interface Booking {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  tickets: Ticket[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function MyTicketsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<number | null>(null);

  const fetchBookings = async () => {
    if (!session?.accessToken || !session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await paymentApi.getUserBookings(parseInt(session.user.id.toString()), session.accessToken);
      setBookings(result.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: number) => {
    if (!session?.accessToken) return;

    // Check if any ticket in this booking is for a past event
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      const hasPastEvent = booking.tickets.some(ticket => {
        const eventDate = new Date(ticket.event.date);
        const now = new Date();
        return eventDate < now;
      });

      if (hasPastEvent) {
        alert('Cannot cancel tickets for events that have already passed.');
        return;
      }
    }

    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    setCancellingBooking(bookingId);

    try {
      await paymentApi.cancelBooking(bookingId, session.accessToken);
      await fetchBookings();
      alert('Booking cancelled successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setCancellingBooking(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'CANCELLED':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';
      case 'PENDING':
        return 'Pending Payment';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isEventPast = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate < now;
  };

  const canCancelBooking = (booking: Booking) => {
    // Can't cancel if any event has passed
    const hasPastEvent = booking.tickets.some(ticket => isEventPast(ticket.event.date));
    return !hasPastEvent && booking.status === 'PENDING';
  };

  const checkPaymentStatus = async (bookingId: number) => {
    if (!session?.accessToken) return;

    try {
      const result = await paymentApi.checkPaymentStatus(`ORDER-${bookingId}`, session.accessToken);
      if (result.data.transaction_status === 'settlement' || result.data.transaction_status === 'capture') {
        // Payment is successful, refresh bookings to get updated status
        await fetchBookings();
        alert('Payment confirmed! Your booking status has been updated.');
      } else {
        alert(`Payment status: ${result.data.transaction_status}. Please complete your payment.`);
      }
    } catch (err) {
      alert('Failed to check payment status. Please try again.');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-md mx-4">
          <div className="text-4xl mb-4">🎫</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">My Tickets</h1>
          <p className="text-gray-600 mb-6">Please login to view your tickets and manage your bookings.</p>
          <Link 
            href="/signin" 
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Tickets</h1>
            <p className="text-gray-600">Manage your concert bookings and tickets</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Payment status updates automatically. Use the refresh button if needed.
          </div>
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠</div>
              <div className="flex-1">
                <p className="text-red-700">{error}</p>
              </div>
              <button 
                onClick={fetchBookings}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading your tickets...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎫</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No tickets yet</h2>
              <p className="text-gray-600 mb-6">You haven't purchased any tickets yet. Start exploring amazing concerts!</p>
              <Link 
                href="/" 
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Booking Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        Booking #{booking.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created: {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Link
                            href={`/payment/status?order_id=ORDER-${booking.id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Check Payment
                          </Link>
                          {canCancelBooking(booking) ? (
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              disabled={cancellingBooking === booking.id}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              {cancellingBooking === booking.id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                              Cannot Cancel
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tickets Grid */}
                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {booking.tickets.map((ticket) => (
                      <div key={ticket.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {/* Event Image */}
                        <div className="aspect-video bg-gray-100 overflow-hidden relative">
                          {ticket.event.image ? (
                            <img 
                              src={ticket.event.image} 
                              alt={ticket.event.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                              🎵
                            </div>
                          )}
                          {isEventPast(ticket.event.date) && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">Event Passed</span>
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {ticket.event.name}
                          </h4>
                          <div className="space-y-1 mb-3 text-sm text-gray-600">
                            <p className={isEventPast(ticket.event.date) ? 'text-red-600 font-medium' : ''}>
                              {formatDate(ticket.event.date)}
                              {isEventPast(ticket.event.date) && ' (Past)'}
                            </p>
                            <p>{ticket.event.venue}</p>
                          </div>
                          
                          {/* Ticket Class */}
                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {ticket.ticketClass.name}
                              </p>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                ticket.status === 'SOLD' ? 'text-green-700 bg-green-50' : 
                                ticket.status === 'AVAILABLE' ? 'text-blue-700 bg-blue-50' : 
                                'text-gray-700 bg-gray-50'
                              }`}>
                                {ticket.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Seat: {ticket.seatNumber}
                            </p>
                            <p className="font-semibold text-green-600">
                              Rp {ticket.ticketClass.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Booking Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Tickets: <span className="font-medium text-gray-900">{booking.tickets.length}</span>
                        </p>
                        <p className="text-xl font-semibold text-gray-900">
                          Total Amount: Rp {booking.totalAmount?.toLocaleString() || '0'}
                        </p>
                      </div>
                      {booking.status === 'CONFIRMED' && (
                        <div className="text-right">
                          <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                            Payment Confirmed
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Updated: {formatDate(booking.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
