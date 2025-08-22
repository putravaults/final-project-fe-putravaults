'use client'

import { useState, useEffect } from "react";
import EventCard from "./eventCards";
import ErrorDisplay from "./ErrorDisplay";
import { eventApi } from "@/lib/api";
import { Event } from "@/lib/types";

interface EventWithPrice extends Event {
    minPrice?: number;
}

export default function Main() {
    const [allEvents, setAllEvents] = useState<EventWithPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 8; // 2 rows of 4 columns = 8 events per page

    useEffect(() => {
        const fetchEventsWithPrices = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Step 1: Fetch all events
                const eventsResponse = await eventApi.getUpcomingEvents();
                const eventsList = eventsResponse.events || [];
                
                // Step 2: Fetch ticket prices for each event
                const eventsWithPrices = await Promise.allSettled(
                    eventsList.map(async (event): Promise<EventWithPrice> => {
                        try {
                            const ticketResponse = await eventApi.getEventTicketClasses(event.id);
                            
                            // Find the minimum price from all ticket classes
                            const minPrice = ticketResponse.ticketClasses.length > 0 
                                ? Math.min(...ticketResponse.ticketClasses.map(tc => tc.price))
                                : undefined;
                            
                            
                            return { ...event, minPrice };
                        } catch (_priceError) {
                            // If price fetching fails, still return the event without price
                            return { ...event, minPrice: undefined };
                        }
                    })
                );
                
                // Process results - include events even if price fetching failed
                const finalEvents: EventWithPrice[] = [];
                eventsWithPrices.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        finalEvents.push(result.value);
                    } else {
                        // Include event without price if price fetching failed
                        finalEvents.push({ ...eventsList[index], minPrice: undefined });
                    }
                });
                
                setAllEvents(finalEvents);
                
            } catch (err) {
        
                setError(err instanceof Error ? err.message : 'Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEventsWithPrices();
    }, []);

    // Calculate pagination
    const totalPages = Math.ceil(allEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const currentEvents = allEvents.slice(startIndex, endIndex);

    // Pagination functions
    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const goToPrevious = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-w-screen-2xl mx-auto pb-20 px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Upcoming Events
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover amazing live music experiences. From rock legends to indie showcases, 
                        find your next unforgettable concert.
                    </p>
                </div>

                {/* Loading skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
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

    // Empty state
    if (allEvents.length === 0) {
        return (
            <div className="max-w-screen-2xl mx-auto pb-20 px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Upcoming Events
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover amazing live music experiences. From rock legends to indie showcases, 
                        find your next unforgettable concert.
                    </p>
                </div>

                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Events Available</h3>
                    <p className="text-gray-500">Check back soon for exciting upcoming concerts!</p>
                </div>
            </div>
        );
    }

    // Success state with events
    return (
        <div className="max-w-screen-2xl mx-auto pb-20 px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Upcoming Events
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover amazing live music experiences. From rock legends to indie showcases, 
                    find your next unforgettable concert.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
                    <p className="text-sm text-green-800">
                        {allEvents.length} event{allEvents.length !== 1 ? 's' : ''} available
                    </p>
                    {totalPages > 1 && (
                        <p className="text-sm text-gray-500">
                            • Page {currentPage} of {totalPages}
                        </p>
                    )}
                </div>
            </div>

            {/* Events Grid - 4 columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentEvents.map((event) => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        minPrice={event.minPrice}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    {/* Previous Button */}
                    <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className={`
                            px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-200
                            ${currentPage === 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }
                        `}
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`
                                        px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-200
                                        ${currentPage === page 
                                            ? 'bg-green-800 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }
                                    `}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className={`
                            px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-200
                            ${currentPage === totalPages 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }
                        `}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}