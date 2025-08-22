// Utility functions for formatting and calculations
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const calculateTotalPrice = (price: number, quantity: number): number => {
  return price * quantity
}

export const isEventUpcoming = (dateString: string): boolean => {
  const eventDate = new Date(dateString)
  const now = new Date()
  return eventDate > now
}

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('should format price correctly in IDR', () => {
      expect(formatPrice(150000)).toBe('Rp 150.000')
      expect(formatPrice(0)).toBe('Rp 0')
      expect(formatPrice(1000000)).toBe('Rp 1.000.000')
    })

    it('should handle decimal prices', () => {
      expect(formatPrice(150000.5)).toBe('Rp 150.000')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly in Indonesian', () => {
      const testDate = '2025-02-15T19:00:00Z'
      const result = formatDate(testDate)
      expect(result).toContain('2025')
      expect(result).toContain('Februari')
      expect(result).toContain('15')
    })

    it('should handle invalid date strings', () => {
      expect(() => formatDate('invalid-date')).not.toThrow()
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const testDate = '2025-02-15T19:30:00Z'
      const result = formatDateTime(testDate)
      expect(result).toContain('2025')
      expect(result).toContain('Februari')
      expect(result).toContain('15')
      expect(result).toContain('19:30')
    })
  })

  describe('calculateTotalPrice', () => {
    it('should calculate total price correctly', () => {
      expect(calculateTotalPrice(150000, 2)).toBe(300000)
      expect(calculateTotalPrice(100000, 1)).toBe(100000)
      expect(calculateTotalPrice(50000, 0)).toBe(0)
    })

    it('should handle edge cases', () => {
      expect(calculateTotalPrice(0, 5)).toBe(0)
      expect(calculateTotalPrice(100, -1)).toBe(-100)
    })
  })

  describe('isEventUpcoming', () => {
    it('should return true for future events', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1) // Tomorrow
      expect(isEventUpcoming(futureDate.toISOString())).toBe(true)
    })

    it('should return false for past events', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1) // Yesterday
      expect(isEventUpcoming(pastDate.toISOString())).toBe(false)
    })

    it('should return false for current time', () => {
      const now = new Date()
      expect(isEventUpcoming(now.toISOString())).toBe(false)
    })
  })
})
