import React from 'react'
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils'
import ErrorDisplay from '@/components/ErrorDisplay'

describe('ErrorDisplay', () => {
  const mockOnRetry = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render error message', () => {
    const errorMessage = 'Something went wrong'
    render(<ErrorDisplay message={errorMessage} onRetry={mockOnRetry} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should render default error message when no message provided', () => {
    render(<ErrorDisplay onRetry={mockOnRetry} />)

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('should call onRetry when retry button is clicked', () => {
    render(<ErrorDisplay message="Test error" onRetry={mockOnRetry} />)

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorDisplay message="Test error" />)

    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
  })

  it('should render with custom title', () => {
    const customTitle = 'Custom Error Title'
    render(<ErrorDisplay title={customTitle} message="Test error" onRetry={mockOnRetry} />)

    expect(screen.getByText(customTitle)).toBeInTheDocument()
  })

  it('should render with default title when no title provided', () => {
    render(<ErrorDisplay message="Test error" onRetry={mockOnRetry} />)

    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
