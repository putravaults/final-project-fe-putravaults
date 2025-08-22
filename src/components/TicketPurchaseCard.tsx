'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import PaymentButton from './PaymentButton';

interface TicketClass {
  id: number;
  name: string;
  description: string;
  price: number;
  availableCount: number;
}

interface TicketPurchaseCardProps {
  eventId: number;
  eventName: string;
  ticketClasses: TicketClass[];
}

export default function TicketPurchaseCard({
  eventId,
  eventName,
  ticketClasses,
}: TicketPurchaseCardProps) {
  const { data: session } = useSession();
  const [selectedTicketClass, setSelectedTicketClass] = useState<TicketClass | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!session) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Tickets</h3>
        <p className="text-gray-600 mb-4">Please login to purchase tickets.</p>
        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Login to Purchase
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Tickets</h3>
      
      {/* Ticket Class Selection */}
      <div className="space-y-3 mb-6">
        {ticketClasses.map((ticketClass) => (
          <div
            key={ticketClass.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedTicketClass?.id === ticketClass.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTicketClass(ticketClass)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{ticketClass.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{ticketClass.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Available: {ticketClass.availableCount} tickets
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  Rp.{ticketClass.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quantity Selection */}
      {selectedTicketClass && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              -
            </button>
            <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(selectedTicketClass.availableCount, quantity + 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Max {selectedTicketClass.availableCount} tickets available
          </p>
        </div>
      )}

      {/* Total Price */}
      {selectedTicketClass && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Price:</span>
            <span className="text-xl font-bold text-green-600">
              Rp {(selectedTicketClass.price * quantity).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Payment Button */}
      {selectedTicketClass && (
        <PaymentButton
          eventId={eventId}
          ticketClassId={selectedTicketClass.id}
          ticketClassName={selectedTicketClass.name}
          price={selectedTicketClass.price}
          quantity={quantity}
          eventName={eventName}
        />
      )}

      {/* Instructions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">Payment Methods:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Bank Transfer (BCA, Mandiri, BNI, BRI)</li>
          <li>• E-Wallets (GoPay, OVO, DANA)</li>
          <li>• Credit/Debit Cards</li>
          <li>• Convenience Stores</li>
        </ul>
      </div>
    </div>
  );
}
