// Examples of how to use the ErrorDisplay component
// This file is for reference - you can delete it after understanding the usage

import ErrorDisplay from './ErrorDisplay'

// Example 1: Basic error (default)
export function BasicError() {
  return <ErrorDisplay />
}

// Example 2: Custom error message
export function CustomError() {
  return (
    <ErrorDisplay
      title="Payment Failed"
      message="Your payment could not be processed. Please check your card details and try again."
      variant="error"
      showRetry={true}
      showHomeButton={true}
    />
  )
}

// Example 3: Warning message
export function WarningMessage() {
  return (
    <ErrorDisplay
      title="Session Expiring Soon"
      message="Your session will expire in 5 minutes. Please save your work."
      variant="warning"
      showRetry={false}
      showHomeButton={false}
    />
  )
}

// Example 4: Info message with custom content
export function InfoWithCustomContent() {
  return (
    <ErrorDisplay
      title="Maintenance Mode"
      message="We're currently performing scheduled maintenance."
      variant="info"
      showRetry={false}
      showHomeButton={true}
    >
      <div className="bg-blue-100 p-4 rounded-sm">
        <p className="text-blue-800 font-semibold">Estimated completion: 2:00 PM</p>
        <p className="text-blue-600 text-sm mt-2">
          We apologize for any inconvenience. All services will be restored shortly.
        </p>
      </div>
    </ErrorDisplay>
  )
}

// Example 5: With custom retry function
export function CustomRetryAction() {
  const handleCustomRetry = () => {
    // Custom retry logic
    console.log('Performing custom retry action...')
    // Maybe refetch data, retry API call, etc.
  }

  return (
    <ErrorDisplay
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection."
      variant="error"
      onRetry={handleCustomRetry}
      showRetry={true}
      showHomeButton={false}
    />
  )
}

// Example 6: Minimal error for smaller spaces
export function MinimalError() {
  return (
    <ErrorDisplay
      title="Error"
      message="Something went wrong."
      variant="error"
      showRetry={true}
      showHomeButton={false}
      className="p-4" // Override padding for smaller display
    />
  )
}

// Usage in your pages/components:
/*

// In a page component (like dashboard):
import ErrorDisplay from "@/components/ErrorDisplay"

export default function SomePage() {
  try {
    // your code...
  } catch (error) {
    return (
      <ErrorDisplay
        title="Failed to Load Data"
        message="Unable to fetch the required information. Please try again."
        variant="error"
        showRetry={true}
        showHomeButton={true}
      />
    )
  }
}

// In a client component with state:
'use client'
import { useState } from 'react'
import ErrorDisplay from "@/components/ErrorDisplay"

export default function ClientComponent() {
  const [error, setError] = useState(null)
  
  if (error) {
    return (
      <ErrorDisplay
        title="Something went wrong"
        message={error.message}
        onRetry={() => {
          setError(null)
          // retry your action
        }}
      />
    )
  }
  
  return <div>Your normal component content</div>
}

*/
