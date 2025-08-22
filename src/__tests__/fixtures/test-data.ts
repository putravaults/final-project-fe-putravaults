import { Event, TicketClass, UpcomingEventsResponse } from '@/lib/types'

export const mockEvent: Event = {
  id: 1,
  name: 'Test Concert',
  description: 'A test concert for testing purposes',
  date: '2025-02-15T19:00:00Z',
  location: 'Test Arena',
  thumbnailUrl: '/test-thumbnail.jpg',
  bannerUrl: '/test-banner.jpg',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  images: [
    {
      id: 1,
      imageUrl: '/test-image-1.jpg',
      altText: 'Test Image 1',
      displayOrder: 1,
      isPrimary: true,
      createdAt: '2025-01-01T00:00:00Z',
    },
  ],
}

export const mockTicketClass: TicketClass = {
  id: 1,
  eventId: 1,
  name: 'VIP',
  description: 'VIP ticket with premium benefits',
  price: 150000,
  totalCount: 100,
  soldCount: 50,
  availableCount: 50,
  createdAt: '2025-01-01T00:00:00Z',
}

export const mockEventsResponse: UpcomingEventsResponse = {
  events: [mockEvent],
  total: 1,
}

export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
}

export const mockAdminUser = {
  id: 2,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'ADMIN',
}
