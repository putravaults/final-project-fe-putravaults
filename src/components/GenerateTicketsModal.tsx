'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Event, Ticket } from '@/lib/types';
import { eventApi } from '@/lib/api';
import { IoCloseOutline, IoAddOutline, IoTrashOutline } from 'react-icons/io5';

interface TicketClass {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface GenerateTicketsModalProps {
  event: Event;
  onClose: () => void;
  onTicketsGenerated: () => void;
}

export default function GenerateTicketsModal({ event, onClose, onTicketsGenerated }: GenerateTicketsModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([
    { name: '', description: '', price: 0, quantity: 0 }
  ]);

  const addTicketClass = () => {
    setTicketClasses([...ticketClasses, { name: '', description: '', price: 0, quantity: 0 }]);
  };

  const removeTicketClass = (index: number) => {
    if (ticketClasses.length > 1) {
      setTicketClasses(ticketClasses.filter((_, i) => i !== index));
    }
  };

  const updateTicketClass = (index: number, field: keyof TicketClass, value: string | number) => {
    const updated = [...ticketClasses];
    updated[index] = { ...updated[index], [field]: value };
    setTicketClasses(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.accessToken) {
      alert('Please login to generate tickets');
      return;
    }

    // Validate form
    const validTicketClasses = ticketClasses.filter(tc => 
      tc.name.trim() && tc.description.trim() && tc.price > 0 && tc.quantity > 0
    );

    if (validTicketClasses.length === 0) {
      alert('Please add at least one valid ticket class');
      return;
    }

    setLoading(true);

    try {
      // First, get existing ticket classes for this event
      const existingTicketClasses = await eventApi.getEventTicketClasses(event.id);
      
      // Create ticket classes (only if they don't already exist)
      const ticketClassPromises = validTicketClasses.map(async (tc) => {
        const existingClass = existingTicketClasses.ticketClasses.find(
          existing => existing.name.toLowerCase() === tc.name.trim().toLowerCase()
        );
        
        if (existingClass) {
          // Use existing ticket class
          return existingClass;
        } else {
          // Create new ticket class
          return await eventApi.createTicketClass({
            eventId: event.id,
            name: tc.name.trim(),
            description: tc.description.trim(),
            price: tc.price,
          }, session.accessToken);
        }
      });

      const createdTicketClasses = await Promise.all(ticketClassPromises);

      // Then, generate tickets for each ticket class
      const ticketPromises = createdTicketClasses.map(async (ticketClass, index) => {
        const quantity = validTicketClasses[index].quantity;
        const tickets = [];

        // Check if this ticket class already has tickets
        const existingTickets = await eventApi.getTicketsByEvent(event.id);
        const ticketsForThisClass = existingTickets.tickets.filter(
          (ticket: Ticket) => ticket.ticketClassId === ticketClass.id
        );

        // Only create new tickets if we need more than what already exists
        const ticketsToCreate = Math.max(0, quantity - ticketsForThisClass.length);

        for (let i = 1; i <= ticketsToCreate; i++) {
          const seatNumber = `${String.fromCharCode(65 + Math.floor((i - 1) / 10))}${i % 10 || 10}`;
          
          const ticket = await eventApi.createTicket({
            eventId: event.id,
            ticketClassId: ticketClass.id,
            seatNumber: seatNumber,
            status: 'AVAILABLE',
          }, session.accessToken);

          tickets.push(ticket);
        }

        return tickets;
      });

      const allTickets = await Promise.all(ticketPromises);
      const totalTicketsCreated = allTickets.flat().length;

      alert(`Successfully generated ${totalTicketsCreated} tickets for ${event.name}!`);
      onTicketsGenerated();
      onClose();

    } catch (error) {
      console.error('Failed to generate tickets:', error);
      alert(`Failed to generate tickets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Generate Tickets</h2>
            <p className="text-gray-600 text-sm mt-1">Create tickets for: {event.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {ticketClasses.map((ticketClass, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">Ticket Class {index + 1}</h3>
                  {ticketClasses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketClass(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <IoTrashOutline className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name *
                    </label>
                    <input
                      type="text"
                      value={ticketClass.name}
                      onChange={(e) => updateTicketClass(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., VIP, General Admission"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Rp) *
                    </label>
                    <input
                      type="number"
                      value={ticketClass.price}
                      onChange={(e) => updateTicketClass(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={ticketClass.description}
                      onChange={(e) => updateTicketClass(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe what's included in this ticket class"
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={ticketClass.quantity}
                      onChange={(e) => updateTicketClass(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTicketClass}
              className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
            >
              <IoAddOutline className="w-4 h-4" />
              Add Another Ticket Class
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Tickets'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
