// @ts-nocheck
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Event } from '@/lib/types';
import { eventApi } from '@/lib/api';
import ErrorDisplay from './ErrorDisplay';
import { IoCalendarOutline, IoLocationOutline, IoPencilOutline, IoTrashOutline, IoAddOutline, IoEyeOutline, IoTicketOutline } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import CreateEventModal from './CreateEventModal';
import EditEventModal from './EditEventModal';
import GenerateTicketsModal from './GenerateTicketsModal';

export default function AdminEventsList() {
    const { data: session } = useSession();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showGenerateTicketsModal, setShowGenerateTicketsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchAllEvents = async () => {
            if (!session?.accessToken) return;
            
            try {
                setLoading(true);
                setError(null);
                const response = await eventApi.getAllEvents(session.accessToken);
                setEvents(response.events || []);
            } catch (err) {
                console.error('Failed to fetch events:', err);
                setError(err instanceof Error ? err.message : 'Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchAllEvents();
    }, [session]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async (eventId: number, eventName: string) => {
        if (!session?.accessToken) return;
        
        if (confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
            try {
                await eventApi.deleteEvent(eventId, session.accessToken);
                // Remove event from local state
                setEvents(events.filter(event => event.id !== eventId));
                alert('Event deleted successfully!');
            } catch (err) {
                console.error('Failed to delete event:', err);
                alert('Failed to delete event. Please try again.');
            }
        }
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setShowEditModal(true);
    };

    const handleGenerateTickets = (event: Event) => {
        setSelectedEvent(event);
        setShowGenerateTicketsModal(true);
    };

    const handleEventCreated = (newEvent: Event) => {
        setEvents([...events, newEvent]);
        setShowCreateModal(false);
    };

    const handleEventUpdated = (updatedEvent: Event) => {
        setEvents(events.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
        ));
        setShowEditModal(false);
        setSelectedEvent(null);
    };

    const handleTicketsGenerated = () => {
        setShowGenerateTicketsModal(false);
        setSelectedEvent(null);
        // Optionally refresh the events list or show a success message
    };

    if (loading) {
        return (
            <div className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Events Management</h2>
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse flex items-center p-4 border border-gray-200 rounded-sm">
                            <div className="w-20 h-20 bg-gray-300 rounded-sm mr-4"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorDisplay
                title="Unable to Load Events"
                message={error}
                variant="error"
                showRetry={true}
                showHomeButton={false}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="bg-white rounded-sm shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Events Management</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {events.length} event{events.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-sm hover:bg-green-900 transition-colors"
                    >
                        <IoAddOutline className="w-4 h-4" />
                        Add New Event
                    </button>
                </div>
            </div>

            {/* Events List */}
            <div className="p-6">
                {events.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoCalendarOutline className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Events Found</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your first event.</p>
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-sm hover:bg-green-900 transition-colors mx-auto"
                        >
                            <IoAddOutline className="w-4 h-4" />
                            Create Event
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="flex items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
                                {/* Event Image */}
                                <div className="w-20 h-20 relative rounded-sm overflow-hidden mr-4 flex-shrink-0">
                                    <Image
                                        src={event.thumbnailUrl || '/Oasis.png'}
                                        alt={event.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate mb-1">{event.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <IoCalendarOutline className="w-3 h-3" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IoLocationOutline className="w-3 h-3" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2 ml-4">
                                    <Link
                                        href={`/event/${event.id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                                        title="View Event"
                                    >
                                        <IoEyeOutline className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleGenerateTickets(event)}
                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-sm transition-colors"
                                        title="Generate Tickets"
                                    >
                                        <IoTicketOutline className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-sm transition-colors"
                                        title="Edit Event"
                                    >
                                        <IoPencilOutline className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id, event.name)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                                        title="Delete Event"
                                    >
                                        <IoTrashOutline className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateEventModal
                    onClose={() => setShowCreateModal(false)}
                    onEventCreated={handleEventCreated}
                />
            )}

            {showEditModal && selectedEvent && (
                <EditEventModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedEvent(null);
                    }}
                    onEventUpdated={handleEventUpdated}
                />
            )}

            {showGenerateTicketsModal && selectedEvent && (
                <GenerateTicketsModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowGenerateTicketsModal(false);
                        setSelectedEvent(null);
                    }}
                    onTicketsGenerated={handleTicketsGenerated}
                />
            )}
        </div>
    );
}
