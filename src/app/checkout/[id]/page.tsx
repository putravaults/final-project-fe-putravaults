'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { eventApi } from '@/lib/api';
import PaymentButton from '@/components/PaymentButton';
import BackButton from '@/components/BackButton';
import MidtransDebug from '@/components/MidtransDebug';
import PaymentTest from '@/components/PaymentTest';

interface TicketClass {
  id: number;
  name: string;
  price: number;
  description?: string;
  availableCount: number;
}

interface CheckoutEvent {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  thumbnailUrl: string;
  bannerUrl: string;
  images: Array<{
    id: number;
    imageUrl: string;
    altText: string;
  }>;
  ticketClasses: TicketClass[];
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<CheckoutEvent | null>(null);
  const [selectedTicketClass, setSelectedTicketClass] = useState<TicketClass | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await eventApi.getEventById(parseInt(eventId));
        
        // Fetch ticket availability to get available seats
        const ticketAvailability = await eventApi.getEventTicketAvailability(parseInt(eventId));
        
        // Combine event data with ticket availability
        const eventWithTickets: CheckoutEvent = {
          ...eventData,
          ticketClasses: ticketAvailability.ticketClasses.map(tc => ({
            id: tc.ticketClassId,
            name: tc.ticketClassName,
            price: tc.price,
            description: tc.description || '',
            availableCount: tc.availableCount
          }))
        };
        
        setEvent(eventWithTickets);
        
        // Set first ticket class as default
        if (eventWithTickets.ticketClasses && eventWithTickets.ticketClasses.length > 0) {
          setSelectedTicketClass(eventWithTickets.ticketClasses[0]);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (selectedTicketClass?.availableCount || 1)) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = selectedTicketClass ? selectedTicketClass.price * quantity : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
          <BackButton />
        </div>
      </div>
    );
  }

  if (!selectedTicketClass) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No tickets available for this event</p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-15 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your ticket purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
            
            {event.thumbnailUrl && (
              <img 
                src={event.thumbnailUrl} 
                alt={event.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
            <p className="text-gray-600 mb-4">{event.description}</p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium w-20">Date:</span>
                <span>{new Date(event.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Time:</span>
                <span>{new Date(event.date).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Venue:</span>
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Ticket Selection & Payment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ticket Selection</h2>
            
            {/* Ticket Class Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Type
              </label>
              <select
                value={selectedTicketClass.id}
                onChange={(e) => {
                  const ticketClass = event.ticketClasses.find(tc => tc.id === parseInt(e.target.value));
                  setSelectedTicketClass(ticketClass || null);
                  setQuantity(1); // Reset quantity when changing ticket class
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {event.ticketClasses.map((ticketClass) => (
                  <option key={ticketClass.id} value={ticketClass.id}>
                    {ticketClass.name} - Rp {ticketClass.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= selectedTicketClass.availableCount}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">
                  {selectedTicketClass.availableCount} available
                </span>
              </div>
            </div>

            {/* Ticket Details */}
            {selectedTicketClass.description && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Ticket Details</h4>
                <p className="text-sm text-gray-600">{selectedTicketClass.description}</p>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t pt-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Price per ticket:</span>
                  <span>Rp {selectedTicketClass.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>Rp {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <PaymentButton
              eventId={event.id}
              ticketClassId={selectedTicketClass.id}
              ticketClassName={selectedTicketClass.name}
              price={selectedTicketClass.price}
              quantity={quantity}
              eventName={event.name}
            />
          </div>
        </div>
      </div>
      
      {/* Debug components for development only */}
      {/* {process.env.NODE_ENV === 'development' && (
        <>
          <MidtransDebug />
          <PaymentTest />
        </>
      )} */}
    </div>
  );
}
