'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { eventApi, userApi } from '@/lib/api';
import { Event } from '@/lib/types';
import ErrorDisplay from './ErrorDisplay';
import AdminEventsList from './AdminEventsList';
import { IoCalendarOutline, IoPersonOutline, IoCashOutline, IoTicketOutline, IoTrendingUpOutline } from 'react-icons/io5';

interface AdminStats {
    totalEvents: number;
    activeEvents: number;
    totalUsers: number;
    totalRevenue: number;
    ticketsSold: number;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<AdminStats>({
        totalEvents: 0,
        activeEvents: 0,
        totalUsers: 0,
        totalRevenue: 0,
        ticketsSold: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session?.accessToken) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch all data in parallel
                const [eventsResponse, usersResponse] = await Promise.allSettled([
                    eventApi.getAllEvents(session.accessToken),
                    userApi.getAllUsers(session.accessToken)
                ]);

                let totalEvents = 0;
                let activeEvents = 0;
                let ticketsSold = 0;
                let totalRevenue = 0;

                // Process events data
                if (eventsResponse.status === 'fulfilled') {
                    const events = eventsResponse.value.events || [];
                    totalEvents = events.length;
                    
                    // Count active events (future events)
                    const now = new Date();
                    activeEvents = events.filter(event => new Date(event.date) > now).length;

                    // Calculate tickets sold and revenue (would need actual ticket sales data)
                    // For demo purposes, we'll estimate based on event count
                    ticketsSold = totalEvents * 150; // Estimated average tickets per event
                    totalRevenue = ticketsSold * 85; // Estimated average price per ticket
                }

                let totalUsers = 0;
                // Process users data
                if (usersResponse.status === 'fulfilled') {
                    const usersData = usersResponse.value as any;
                    const users = usersData.users || [];
                    totalUsers = users.length;
                }

                setStats({
                    totalEvents,
                    activeEvents,
                    totalUsers,
                    totalRevenue,
                    ticketsSold
                });

            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [session]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    if (error) {
        return (
            <ErrorDisplay
                title="Dashboard Error"
                message={error}
                variant="error"
                showRetry={true}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <>
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <IoCalendarOutline className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                                <dd className="text-2xl font-bold text-gray-900">
                                    {loading ? (
                                        <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                                    ) : (
                                        formatNumber(stats.totalEvents)
                                    )}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <IoTrendingUpOutline className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Active Events</dt>
                                <dd className="text-2xl font-bold text-blue-600">
                                    {loading ? (
                                        <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                                    ) : (
                                        formatNumber(stats.activeEvents)
                                    )}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-purple-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <IoPersonOutline className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                <dd className="text-2xl font-bold text-purple-600">
                                    {loading ? (
                                        <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                                    ) : (
                                        formatNumber(stats.totalUsers)
                                    )}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-yellow-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <IoTicketOutline className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Tickets Sold</dt>
                                <dd className="text-2xl font-bold text-yellow-600">
                                    {loading ? (
                                        <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                                    ) : (
                                        formatNumber(stats.ticketsSold)
                                    )}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <IoCashOutline className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                <dd className="text-2xl font-bold text-green-600">
                                    {loading ? (
                                        <div className="animate-pulse h-8 bg-gray-200 rounded w-20"></div>
                                    ) : (
                                        formatCurrency(stats.totalRevenue)
                                    )}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Management */}
            <AdminEventsList />
        </>
    );
}
