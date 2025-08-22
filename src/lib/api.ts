import { Backend_URL } from './constant';
import { UpcomingEventsResponse, Event, TicketClassesResponse, TicketAvailabilityResponse, TicketsResponse } from './types';

// Helper function for consistent error handling
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.log('API Error Response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
};

// Event API functions
export const eventApi = {
  // Get upcoming events
  getUpcomingEvents: async (): Promise<UpcomingEventsResponse> => {
    const response = await fetch(`${Backend_URL}/event/upcoming`);
    await handleApiError(response);
    return await response.json();
  },

  // Get all events (admin only)
  getAllEvents: async (token?: string): Promise<UpcomingEventsResponse> => {
    const response = await fetch(`${Backend_URL}/event/all`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    });
    await handleApiError(response);
    return await response.json();
  },

  // Get single event by ID
  getEventById: async (id: number): Promise<Event> => {
    const response = await fetch(`${Backend_URL}/event/${id}`);
    await handleApiError(response);
    return await response.json();
  },

  // Get ticket classes for an event
  getEventTicketClasses: async (eventId: number): Promise<TicketClassesResponse> => {
    const response = await fetch(`${Backend_URL}/event/${eventId}/ticket-classes`);
    await handleApiError(response);
    return await response.json();
  },

  // Get ticket availability for an event
  getEventTicketAvailability: async (eventId: number): Promise<TicketAvailabilityResponse> => {
    const response = await fetch(`${Backend_URL}/ticket/event/${eventId}/availability`);
    await handleApiError(response);
    return await response.json();
  },

  // Get available tickets by ticket class
  getAvailableTicketsByClass: async (ticketClassId: number): Promise<{ tickets: Array<{ id: number; seatNumber: string; status: string }> }> => {
    const response = await fetch(`${Backend_URL}/ticket/ticket-class/${ticketClassId}`);
    await handleApiError(response);
    return await response.json();
  },

  // Get all tickets by event
  getTicketsByEvent: async (eventId: number): Promise<TicketsResponse> => {
    const response = await fetch(`${Backend_URL}/ticket/event/${eventId}`);
    await handleApiError(response);
    return await response.json();
  },

  // Create new event (admin only)
  createEvent: async (eventData: Partial<Event>, token: string): Promise<Event> => {
    const response = await fetch(`${Backend_URL}/event/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Update event (admin only)
  updateEvent: async (id: number, eventData: Partial<Event>, token: string): Promise<Event> => {
    const response = await fetch(`${Backend_URL}/event/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Delete event (admin only)
  deleteEvent: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${Backend_URL}/event/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    await handleApiError(response);
    // Delete typically returns 204 No Content, so no need to parse JSON
  },

  // Create ticket class (admin only)
  createTicketClass: async (ticketClassData: {
    eventId: number;
    name: string;
    description: string;
    price: number;
  }, token: string) => {
    const response = await fetch(`${Backend_URL}/event/ticket-class/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(ticketClassData),
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Create ticket (admin only)
  createTicket: async (ticketData: {
    eventId: number;
    ticketClassId: number;
    seatNumber: string;
    status: string;
  }, token: string) => {
    const response = await fetch(`${Backend_URL}/ticket/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
    });
    
    await handleApiError(response);
    return await response.json();
  },
};

// User API functions
export const userApi = {
  // Get all users (admin only)
  getAllUsers: async (token: string) => {
    const response = await fetch(`${Backend_URL}/user/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Create user (admin only)
  createUser: async (userData: { name: string; email: string; password: string; role?: string }, token: string) => {
    const response = await fetch(`${Backend_URL}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    
    await handleApiError(response);
    return await response.json();
  },
};

// Payment API functions
export const paymentApi = {
  // Create booking with ticket class IDs and quantities
  createBooking: async (bookingData: {
    userId: number;
    tickets: Array<{
      ticketClassId: number;
      quantity: number;
    }>;
  }, token: string) => {
    console.log('API createBooking - sending data:', JSON.stringify(bookingData, null, 2));
    console.log('API createBooking - userId:', bookingData.userId, 'type:', typeof bookingData.userId);
    console.log('API createBooking - tickets:', bookingData.tickets);
    
    const response = await fetch(`${Backend_URL}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Create payment through backend (to avoid CORS issues)
  createPayment: async (paymentData: {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    itemDetails: Array<{
      id: string;
      price: number;
      quantity: number;
      name: string;
    }>;
  }, token: string) => {
    console.log('API createPayment - sending data:', JSON.stringify(paymentData, null, 2));
    
    const response = await fetch(`${Backend_URL}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Check payment status
  checkPaymentStatus: async (orderId: string, token: string) => {
    console.log('API checkPaymentStatus - orderId:', orderId);
    
    const response = await fetch(`${Backend_URL}/payment/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Get booking details
  getBooking: async (bookingId: number, token: string) => {
    const response = await fetch(`${Backend_URL}/booking/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Get user bookings
  getUserBookings: async (userId: number, token: string) => {
    const response = await fetch(`${Backend_URL}/booking/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    await handleApiError(response);
    return await response.json();
  },

  // Cancel booking
  cancelBooking: async (bookingId: number, token: string) => {
    const response = await fetch(`${Backend_URL}/booking/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    await handleApiError(response);
    return await response.json();
  },
};
