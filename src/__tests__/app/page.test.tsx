import React from 'react'
import { render, screen } from '@/__tests__/utils/test-utils'
import Home from '@/app/page'

// Mock the components
jest.mock('@/components/hero', () => {
  return function MockHero() {
    return <div data-testid="hero-component">Hero Component</div>
  }
})

jest.mock('@/components/header', () => {
  return function MockHeader() {
    return <div data-testid="header-component">Header Component</div>
  }
})

jest.mock('@/components/main', () => {
  return function MockMain() {
    return <div data-testid="main-component">Main Component</div>
  }
})

describe('Home Page', () => {
  it('should render all main components', () => {
    render(<Home />)

    expect(screen.getByTestId('header-component')).toBeInTheDocument()
    expect(screen.getByTestId('hero-component')).toBeInTheDocument()
    expect(screen.getByTestId('main-component')).toBeInTheDocument()
  })

  it('should render components in correct order', () => {
    render(<Home />)

    const container = screen.getByRole('main')
    const children = Array.from(container.children)

    // Check that components are rendered in the expected order
    expect(children[0]).toHaveAttribute('data-testid', 'header-component')
    expect(children[1]).toHaveAttribute('data-testid', 'hero-component')
    expect(children[2]).toHaveAttribute('data-testid', 'main-component')
  })

  it('should have correct CSS classes', () => {
    render(<Home />)

    const mainContainer = screen.getByRole('main')
    expect(mainContainer).toHaveClass('min-h-screen')
  })

  it('should render events section with correct styling', () => {
    render(<Home />)

    const eventsSection = screen.getByTestId('main-component').closest('section')
    expect(eventsSection).toHaveClass('py-8')
  })
})
