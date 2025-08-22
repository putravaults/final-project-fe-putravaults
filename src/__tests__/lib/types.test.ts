import { Event, TicketClass, UpcomingEventsResponse, TicketClassesResponse } from '@/lib/types'

describe('Type Definitions', () => {
  describe('Event interface', () => {
    it('should have all required properties', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        description: 'Test Description',
        date: '2025-02-15T19:00:00Z',
        location: 'Test Location',
        thumbnailUrl: '/thumbnail.jpg',
        bannerUrl: '/banner.jpg',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        images: [],
      }

      expect(event.id).toBe(1)
      expect(event.name).toBe('Test Event')
      expect(event.description).toBe('Test Description')
      expect(event.date).toBe('2025-02-15T19:00:00Z')
      expect(event.location).toBe('Test Location')
      expect(event.thumbnailUrl).toBe('/thumbnail.jpg')
      expect(event.bannerUrl).toBe('/banner.jpg')
      expect(event.createdAt).toBe('2025-01-01T00:00:00Z')
      expect(event.updatedAt).toBe('2025-01-01T00:00:00Z')
      expect(event.images).toEqual([])
    })

    it('should handle images array', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        description: 'Test Description',
        date: '2025-02-15T19:00:00Z',
        location: 'Test Location',
        thumbnailUrl: '/thumbnail.jpg',
        bannerUrl: '/banner.jpg',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        images: [
          {
            id: 1,
            imageUrl: '/image1.jpg',
            altText: 'Image 1',
            displayOrder: 1,
            isPrimary: true,
            createdAt: '2025-01-01T00:00:00Z',
          },
        ],
      }

      expect(event.images).toHaveLength(1)
      expect(event.images[0].id).toBe(1)
      expect(event.images[0].imageUrl).toBe('/image1.jpg')
      expect(event.images[0].altText).toBe('Image 1')
      expect(event.images[0].displayOrder).toBe(1)
      expect(event.images[0].isPrimary).toBe(true)
    })
  })

  describe('TicketClass interface', () => {
    it('should have all required properties', () => {
      const ticketClass: TicketClass = {
        id: 1,
        eventId: 1,
        name: 'VIP',
        description: 'VIP ticket',
        price: 150000,
        totalCount: 100,
        soldCount: 50,
        availableCount: 50,
        createdAt: '2025-01-01T00:00:00Z',
      }

      expect(ticketClass.id).toBe(1)
      expect(ticketClass.eventId).toBe(1)
      expect(ticketClass.name).toBe('VIP')
      expect(ticketClass.description).toBe('VIP ticket')
      expect(ticketClass.price).toBe(150000)
      expect(ticketClass.totalCount).toBe(100)
      expect(ticketClass.soldCount).toBe(50)
      expect(ticketClass.availableCount).toBe(50)
      expect(ticketClass.createdAt).toBe('2025-01-01T00:00:00Z')
    })
  })

  describe('UpcomingEventsResponse interface', () => {
    it('should have correct structure', () => {
      const response: UpcomingEventsResponse = {
        events: [],
        total: 0,
      }

      expect(response.events).toEqual([])
      expect(response.total).toBe(0)
    })

    it('should handle events array', () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        description: 'Test Description',
        date: '2025-02-15T19:00:00Z',
        location: 'Test Location',
        thumbnailUrl: '/thumbnail.jpg',
        bannerUrl: '/banner.jpg',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        images: [],
      }

      const response: UpcomingEventsResponse = {
        events: [event],
        total: 1,
      }

      expect(response.events).toHaveLength(1)
      expect(response.events[0]).toEqual(event)
      expect(response.total).toBe(1)
    })
  })

  describe('TicketClassesResponse interface', () => {
    it('should have correct structure', () => {
      const response: TicketClassesResponse = {
        ticketClasses: [],
        eventId: 1,
        total: 0,
      }

      expect(response.ticketClasses).toEqual([])
      expect(response.eventId).toBe(1)
      expect(response.total).toBe(0)
    })

    it('should handle ticket classes array', () => {
      const ticketClass: TicketClass = {
        id: 1,
        eventId: 1,
        name: 'VIP',
        description: 'VIP ticket',
        price: 150000,
        totalCount: 100,
        soldCount: 50,
        availableCount: 50,
        createdAt: '2025-01-01T00:00:00Z',
      }

      const response: TicketClassesResponse = {
        ticketClasses: [ticketClass],
        eventId: 1,
        total: 1,
      }

      expect(response.ticketClasses).toHaveLength(1)
      expect(response.ticketClasses[0]).toEqual(ticketClass)
      expect(response.eventId).toBe(1)
      expect(response.total).toBe(1)
    })
  })
})
