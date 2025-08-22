import { eventApi } from '@/lib/api'
import { mockEvent, mockEventsResponse } from '../fixtures/test-data'

// Mock the constant file
jest.mock('@/lib/constant', () => ({
  Backend_URL: 'http://localhost:3001',
}))

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('eventApi.getUpcomingEvents', () => {
    it('should fetch upcoming events successfully', async () => {
      const mockResponse = mockEventsResponse
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await eventApi.getUpcomingEvents()

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/event/upcoming')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Event not found'
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => errorMessage,
      })

      await expect(eventApi.getUpcomingEvents()).rejects.toThrow('HTTP 404: Event not found')
    })
  })

  describe('eventApi.getEventById', () => {
    it('should fetch event by ID successfully', async () => {
      const mockResponse = mockEvent
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await eventApi.getEventById(1)

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/event/1')
      expect(result).toEqual(mockEvent)
    })

    it('should handle event not found error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Event not found',
      })

      await expect(eventApi.getEventById(999)).rejects.toThrow('HTTP 404: Event not found')
    })
  })

  describe('eventApi.createEvent', () => {
    it('should create event successfully', async () => {
      const eventData = {
        name: 'New Concert',
        description: 'A new concert',
        date: '2025-03-15T19:00:00Z',
        location: 'New Arena',
      }
      const token = 'test-token'
      const mockResponse = { ...mockEvent, ...eventData, id: 2 }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await eventApi.createEvent(eventData, token)

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/event/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle creation error', async () => {
      const eventData = { name: 'Invalid Event' }
      const token = 'test-token'

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid event data',
      })

      await expect(eventApi.createEvent(eventData, token)).rejects.toThrow(
        'HTTP 400: Invalid event data'
      )
    })
  })

  describe('eventApi.deleteEvent', () => {
    it('should delete event successfully', async () => {
      const token = 'test-token'
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      })

      await eventApi.deleteEvent(1, token)

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/event/1', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    })

    it('should handle deletion error', async () => {
      const token = 'test-token'
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => 'Unauthorized',
      })

      await expect(eventApi.deleteEvent(1, token)).rejects.toThrow('HTTP 403: Unauthorized')
    })
  })
})
