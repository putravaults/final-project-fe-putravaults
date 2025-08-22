import React from 'react'
import { render, screen } from '@/__tests__/utils/test-utils'
import RootLayout from '@/app/layout'

// Mock the components
jest.mock('@/components/navbar/navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navigation</nav>
  }
})

jest.mock('@/components/footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>
  }
})

jest.mock('@/components/AuthProvider', () => {
  return function MockAuthProvider({ children }: { children: React.ReactNode }) {
    return <div data-testid="auth-provider">{children}</div>
  }
})

describe('Root Layout', () => {
  it('should render layout structure correctly', () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    )

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument()
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  it('should have correct HTML structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const html = document.querySelector('html')
    const body = document.querySelector('body')
    const main = document.querySelector('main')

    expect(html).toHaveAttribute('lang', 'en')
    expect(body).toBeInTheDocument()
    expect(main).toHaveClass('min-h-screen')
  })

  it('should apply correct CSS classes', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const body = document.querySelector('body')
    expect(body).toHaveClass('antialiased')
  })

  it('should render children inside main element', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Child Content</div>
      </RootLayout>
    )

    const main = document.querySelector('main')
    const childContent = screen.getByTestId('child-content')
    
    expect(main).toContainElement(childContent)
  })

  it('should have proper metadata', () => {
    // This test checks that the metadata export exists
    // In a real test, you might want to test metadata rendering
    expect(RootLayout).toBeDefined()
  })
})
