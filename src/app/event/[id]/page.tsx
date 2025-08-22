'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  IoCalendarOutline, 
  IoLocationOutline, 
  IoTimeOutline,
  IoTicketOutline,
  IoArrowBackOutline,
  IoMusicalNotesOutline
} from 'react-icons/io5';
import { Event, TicketClass } from '@/lib/types';
import { eventApi } from '@/lib/api';
import ErrorDisplay from '@/components/ErrorDisplay';
import BackButton from '@/components/BackButton';
import TicketPurchaseCard from '@/components/TicketPurchaseCard';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage() {
  const params = useParams();
  const eventId = parseInt(params.id as string);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketClassesLoading, setTicketClassesLoading] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch event details
        const eventData = await eventApi.getEventById(eventId);
        setEvent(eventData);
        
        // Fetch ticket classes
        setTicketClassesLoading(true);
        try {
          const ticketData = await eventApi.getEventTicketClasses(eventId);
          setTicketClasses(ticketData.ticketClasses);
        } catch (ticketError) {
          console.warn('Could not fetch ticket classes:', ticketError);
          // Don't set error state for ticket classes, just show without pricing
        } finally {
          setTicketClassesLoading(false);
        }
        
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId && !isNaN(eventId)) {
      fetchEventData();
    } else {
      setError('Invalid event ID');
      setLoading(false);
    }
  }, [eventId]);

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGenre = (name: string, description: string) => {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();
    
    if (lowerName.includes('rock') || lowerDesc.includes('rock')) return 'Rock';
    if (lowerName.includes('pop') || lowerDesc.includes('pop')) return 'Pop';
    if (lowerName.includes('jazz') || lowerDesc.includes('jazz')) return 'Jazz';
    if (lowerName.includes('electronic') || lowerDesc.includes('electronic')) return 'Electronic';
    if (lowerName.includes('classical') || lowerDesc.includes('classical')) return 'Classical';
    if (lowerName.includes('hip hop') || lowerDesc.includes('hip hop')) return 'Hip Hop';
    if (lowerName.includes('indie') || lowerDesc.includes('indie')) return 'Indie';
    return 'Live Music';
  };

  const getMinPrice = () => {
    if (ticketClasses.length === 0) return null;
    return Math.min(...ticketClasses.map(tc => tc.price));
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <ErrorDisplay 
            message={error || 'Event not found'} 
            onRetry={() => window.location.reload()} 
          />
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-green-800 hover:text-green-900 font-medium"
            >
              <IoArrowBackOutline className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const genre = getGenre(event.name, event.description);
  const minPrice = getMinPrice();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={event.bannerUrl || event.thumbnailUrl || '/Oasis.png'}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {/* Back button */}
            <div className="mb-6">
              <BackButton />
            </div>
            
            {/* Event title and details */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md">
                  <IoMusicalNotesOutline className="w-4 h-4" />
                  {genre}
                </span>
                {minPrice && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-md">
                    From ${minPrice}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {event.name}
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <IoCalendarOutline className="w-5 h-5 text-green-400" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IoTimeOutline className="w-5 h-5 text-green-400" />
                  <span>{formatTime(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IoLocationOutline className="w-5 h-5 text-green-400" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Event Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
              
              {/* Event Images Gallery */}
              {event.images && event.images.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.images.map((image) => (
                      <div key={image.id} className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={image.altText}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {ticketClassesLoading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading tickets...</p>
                </div>
              ) : ticketClasses.length > 0 ? (
                <TicketPurchaseCard
                  eventId={eventId}
                  eventName={event.name}
                  ticketClasses={ticketClasses}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <IoTicketOutline className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Tickets information</p>
                  <p className="text-sm text-gray-500">Contact event organizer for ticket details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
