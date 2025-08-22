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