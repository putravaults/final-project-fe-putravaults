// @ts-nocheck
'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  PaymentStatus, 
  getPaymentInstructions, 
  formatPaymentAmount, 
  getPaymentStatusDescription 
} from '@/lib/midtrans';
import Link from 'next/link';
import { 
  IoCheckmarkCircle, 
  IoCloseCircle, 
  IoTimeOutline, 
  IoHome, 
  IoReceipt, 
  IoCardOutline,
  IoInformationCircle,
  IoCopyOutline,
  IoRefreshOutline,
  IoArrowBack
} from 'react-icons/io5';

interface BookingDetails {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  tickets: Array<{
    id: number;
    seatNumber: string;
    status: string;
    ticketClass: {
      id: number;
      name: string;
      price: number;
    };
    event: {
      id: number;
      name: string;
      date: string;
      venue: string;
      image: string;
    };
  }>;
}

function PaymentStatusContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const bookingIdFromQuery = searchParams.get('booking_id');
  const paymentIdFromQuery = searchParams.get('payment_id');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (!bookingIdFromQuery && !orderIdFromQuery) {
        setError('No booking or order ID provided');
        setLoading(false);
        return;
      }

      try {
        const paymentId = paymentIdFromQuery 
        // Check payment status via API route
        const statusResponse = await fetch(`/api/payment/status?order_id=${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
          },
        });
        
        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          throw new Error(errorData.error || 'Failed to check payment status');
        }
        
        const status = await statusResponse.json();
        setPaymentStatus(status);
        
        // Determine booking ID
        const bookingId = bookingIdFromQuery
        // Fetch booking details if we have session
        if (session?.accessToken && bookingId) {
          try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
              headers: {
                'Authorization': `Bearer ${session.accessToken}`,
              },
            });
            if (response.ok) {
              const booking = await response.json();
              setBookingDetails(booking);
            }
          } catch (err) {
            console.log('Could not fetch booking details:', err);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check payment status');
        console.error('Payment status check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [bookingIdFromQuery, paymentIdFromQuery, session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settlement':
      case 'capture':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'deny':
      case 'expire':
      case 'cancel':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'settlement':
      case 'capture':
        return <IoCheckmarkCircle className="w-6 h-6 text-green-600" />;
      case 'pending':
        return <IoTimeOutline className="w-6 h-6 text-yellow-600" />;
      case 'deny':
      case 'expire':
      case 'cancel':
        return <IoCloseCircle className="w-6 h-6 text-red-600" />;
      default:
        return <IoInformationCircle className="w-6 h-6 text-gray-600" />;
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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

  const refreshStatus = async () => {
    if (!bookingIdFromQuery && !paymentIdFromQuery) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const orderId = paymentIdFromQuery 
      const statusResponse = await fetch(`/api/payment/status?order_id=${orderId}`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      
      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.error || 'Failed to refresh payment status');
      }
      
      const status = await statusResponse.json();
      setPaymentStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh payment status');
      console.error('Payment status refresh failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingIdFromQuery && !paymentIdFromQuery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-4">
          <div className="text-center">
            <IoInformationCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Status</h1>
            <p className="text-gray-600 mb-6">No booking or order ID provided.</p>
            <Link
              href="/my-tickets"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <IoArrowBack className="w-4 h-4 mr-2" />
              Back to My Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Link
                href="/my-tickets"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IoArrowBack className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Status</h1>
                <p className="text-sm text-gray-600">Order ID: {paymentIdFromQuery}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshStatus}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <IoRefreshOutline className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Checking...' : 'Refresh'}
              </button>
              <Link
                href="/my-tickets"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                My Tickets
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center">
                <IoCloseCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            </div>
          )}
        </div>

        {paymentStatus ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Status Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                  {getStatusIcon(paymentStatus.transaction_status)}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {getStatusText(paymentStatus.transaction_status)}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {getPaymentStatusDescription(paymentStatus.transaction_status)}
                    </p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment ID</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm font-mono text-gray-900">{paymentStatus.order_id}</p>
                        <button
                          onClick={() => copyToClipboard(paymentStatus.order_id, 'orderId')}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <IoCopyOutline className="w-4 h-4" />
                        </button>
                      </div>
                      {copied === 'orderId' && (
                        <p className="text-xs text-green-600 mt-1">Copied!</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatPaymentAmount(paymentStatus.gross_amount)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {paymentStatus.payment_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transaction Time</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(paymentStatus.transaction_time)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Virtual Account Numbers */}
                {paymentStatus.va_numbers && paymentStatus.va_numbers.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Virtual Account Numbers
                    </label>
                    <div className="space-y-3">
                      {paymentStatus.va_numbers.map((va, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{va.bank.toUpperCase()}</p>
                              <p className="text-lg font-mono text-gray-700">{va.va_number}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(va.va_number, `va-${index}`)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <IoCopyOutline className="w-4 h-4" />
                            </button>
                          </div>
                          {copied === `va-${index}` && (
                            <p className="text-xs text-green-600 mt-1">Copied!</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Instructions */}
                {paymentStatus.transaction_status === 'pending' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Payment Instructions</h3>
                    <div className="space-y-1 text-sm text-yellow-700">
                      {getPaymentInstructions(paymentStatus).map((instruction, index) => (
                        <p key={index}>{instruction}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {paymentStatus.transaction_status === 'settlement' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800 mb-2">Payment Successful!</h3>
                    <p className="text-sm text-green-700">
                      Your payment has been confirmed.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                
                {bookingDetails ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Booking ID</label>
                      <p className="mt-1 text-sm text-gray-900">#{bookingDetails.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Tickets</label>
                      <p className="mt-1 text-sm text-gray-900">{bookingDetails.tickets.length}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatPaymentAmount(bookingDetails.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Created</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(bookingDetails.createdAt)}</p>
                    </div>
                    
                    {/* Event Preview */}
                    {bookingDetails.tickets.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Event</h4>
                        <div className="space-y-2">
                          {bookingDetails.tickets.slice(0, 2).map((ticket) => (
                            <div key={ticket.id} className="flex items-center space-x-3">
                              {ticket.event.image && (
                                <img 
                                  src={ticket.event.image} 
                                  alt={ticket.event.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {ticket.event.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {formatDate(ticket.event.date)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {bookingDetails.tickets.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{bookingDetails.tickets.length - 2} more tickets
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <IoReceipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Booking details not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking payment status...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <IoInformationCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No payment information available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}
