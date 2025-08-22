'use client'

import { ReactNode } from 'react'
import { IoRefreshOutline, IoHomeOutline, IoAlertCircleOutline } from 'react-icons/io5'
import Link from 'next/link'
import Logo from './logo'

interface ErrorDisplayProps {
  title?: string
  message?: string
  variant?: 'error' | 'warning' | 'info'
  showRetry?: boolean
  showHomeButton?: boolean
  onRetry?: () => void
  className?: string
  children?: ReactNode
}

export default function ErrorDisplay({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  variant = 'error',
  showRetry = true,
  showHomeButton = false,
  onRetry,
  className = "",
  children
}: ErrorDisplayProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          container: 'bg-gray-50 border-gray-200',
          title: 'text-gray-800',
          message: 'text-gray-600',
          icon: 'text-gray-400',
          accent: 'text-green-800'
        }
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-100',
          title: 'text-gray-800',
          message: 'text-gray-600',
          icon: 'text-amber-400',
          accent: 'text-green-800'
        }
      case 'info':
        return {
          container: 'bg-green-50 border-green-100',
          title: 'text-gray-800',
          message: 'text-gray-600',
          icon: 'text-green-400',
          accent: 'text-green-800'
        }
    }
  }

  const styles = getVariantStyles()

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      // Default retry behavior - refresh the page
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <div className={`${styles.container} border rounded-sm shadow-sm p-6 text-center ${className}`}>
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Logo 
              color="green"
              className="w-32 h-8"
            />
          </div>

          {/* Small decorative divider */}
          <div className="w-12 h-px bg-green-200 mx-auto mb-4"></div>

          {/* Error Icon - smaller and more subtle */}
          <div className="flex justify-center mb-4">
            <IoAlertCircleOutline className={`w-8 h-8 ${styles.icon}`} />
          </div>

          {/* Title */}
          <h2 className={`text-lg font-semibold ${styles.title} mb-2`}>
            {title}
          </h2>

          {/* Message */}
          <p className={`${styles.message} text-sm mb-6 leading-relaxed`}>
            {message}
          </p>

          {/* Custom content */}
          {children && (
            <div className="mb-6">
              {children}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {showRetry && (
              <button
                onClick={handleRetry}
                className="
                  bg-green-800 hover:bg-green-900 text-white
                  px-4 py-2 rounded-sm font-medium text-sm
                  transition-all duration-200 
                  flex items-center gap-2
                  hover:shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                "
              >
                <IoRefreshOutline className="w-4 h-4" />
                Try Again
              </button>
            )}

            {showHomeButton && (
              <Link
                href="/"
                className="
                  bg-gray-100 hover:bg-gray-200 text-gray-700 
                  px-4 py-2 rounded-sm font-medium text-sm
                  transition-all duration-200 
                  flex items-center gap-2
                  hover:shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                "
              >
                <IoHomeOutline className="w-4 h-4" />
                Back to Home
              </Link>
            )}
          </div>

          {/* Support note - smaller and more subtle */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
