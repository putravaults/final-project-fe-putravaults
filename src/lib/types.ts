// API Response Types
export interface EventImage {
  id: number;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  thumbnailUrl: string;
  bannerUrl: string;
  createdAt: string;
  updatedAt: string;
  images: EventImage[];
}

export interface UpcomingEventsResponse {
  events: Event[];
  total: number;
}

export interface TicketClass {
  id: number;
  eventId: number;
  name: string;
  description: string;
  price: number;
  totalCount: number;
  soldCount: number;
  availableCount: number;
  createdAt: string;
}

export interface TicketClassesResponse {
  ticketClasses: TicketClass[];
  eventId: number;
  total: number;
}

export interface TicketAvailabilityClass {
  ticketClassId: number;
  ticketClassName: string;
  description: string | null;
  price: number;
  totalCount: number;
  soldCount: number;
  reservedCount: number;
  availableCount: number;
}

export interface TicketAvailabilityResponse {
  eventId: number;
  eventName: string;
  ticketClasses: TicketAvailabilityClass[];
  totalAvailable: number;
}

export interface Ticket {
  id: number;
  eventId: number;
  ticketClassId: number;
  bookingId: number | null;
  seatNumber: string | null;
  status: string;
  ticketClass: {
    id: number;
    name: string;
    description: string | null;
    price: number;
  };
  event: {
    id: number;
    name: string;
    date: Date;
    location: string;
  };
}

export interface TicketsResponse {
  tickets: Ticket[];
  total: number;
}