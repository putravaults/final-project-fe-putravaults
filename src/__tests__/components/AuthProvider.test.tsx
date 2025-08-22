import React from 'react'
import { render, screen } from '@/__tests__/utils/test-utils'
import AuthProvider from '@/components/AuthProvider'

describe('AuthProvider', () => {
  it('should render children without crashing', () => {
    render(
      <AuthProvider>
        <div data-testid="test-child">Test Child</div>
      </AuthProvider>
    )

    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('should render multiple children', () => {
    render(
      <AuthProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </AuthProvider>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('should render empty children', () => {
    render(<AuthProvider>{null}</AuthProvider>)
    
    // Should not crash
    expect(document.body).toBeInTheDocument()
  })
})
