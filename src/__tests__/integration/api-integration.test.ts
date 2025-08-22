import { eventApi } from '@/lib/api'
import { mockEvent, mockEventsResponse } from '../fixtures/test-data'

// Mock the constant file
jest.mock('@/lib/constant', () => ({
  Backend_URL: 'http://localhost:3001',
}))

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Event API Integration', () => {
    it('should handle complete event lifecycle', async () => {
      // 1. Create event
      const createEventData = {
        name: 'Integration Test Concert',
        description: 'Test concert for integration testing',
        date: '2025-03-15T19:00:00Z',
        location: 'Test Arena',
      }
      const token = 'test-token'
      const createdEvent = { ...mockEvent, ...createEventData, id: 999 }

      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createdEvent,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createdEvent,
        })
        .mockResolvedValueOnce({
          ok: true,
        })

      // Create event
      const result = await eventApi.createEvent(createEventData, token)
      expect(result).toEqual(createdEvent)

      // Get event by ID
      const fetchedEvent = await eventApi.getEventById(999)
      expect(fetchedEvent).toEqual(createdEvent)

      // Delete event
      await eventApi.deleteEvent(999, token)
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should handle error scenarios gracefully', async () => {
      // Test network error
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(eventApi.getUpcomingEvents()).rejects.toThrow('Network error')

      // Test API error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal server error',
      })

      await expect(eventApi.getUpcomingEvents()).rejects.toThrow('HTTP 500: Internal server error')
    })
  })

  describe('API Error Handling', () => {
    it('should handle different HTTP status codes', async () => {
      const statusCodes = [400, 401, 403, 404, 500]
      
      for (const statusCode of statusCodes) {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: statusCode,
          text: async () => `Error ${statusCode}`,
        })

        await expect(eventApi.getUpcomingEvents()).rejects.toThrow(`HTTP ${statusCode}: Error ${statusCode}`)
      }
    })

    it('should handle malformed JSON responses', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(eventApi.getUpcomingEvents()).rejects.toThrow('Invalid JSON')
    })
  })

  describe('API Request Configuration', () => {
    it('should send correct headers for authenticated requests', async () => {
      const token = 'test-auth-token'
      const eventData = { name: 'Test Event' }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      })

      await eventApi.createEvent(eventData, token)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/event/create',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        })
      )
    })

    it('should handle requests without authentication', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsResponse,
      })

      await eventApi.getAllEvents()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/event/all',
        expect.objectContaining({
          headers: {},
        })
      )
    })
  })
})
