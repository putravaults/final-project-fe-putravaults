'use client';

import Link from 'next/link';
import { IoArrowBackOutline, IoDocumentTextOutline } from 'react-icons/io5';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-green-800 hover:text-green-900 font-medium"
            >
              <IoArrowBackOutline className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <IoDocumentTextOutline className="w-12 h-12 text-green-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Terms & Conditions
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using our concert booking platform.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using Concerto's concert booking platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Concerto ("Company," "we," "us," or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Ticket Sales and Purchases</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Ticket Availability</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All ticket sales are subject to availability and acceptance by the event organizer. We reserve the right to limit the quantity of tickets available for purchase and to refuse service to any customer.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Pricing</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ticket prices are set by event organizers and may include additional fees for payment processing and platform services. All prices are displayed in USD and include applicable taxes unless otherwise specified.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Payment</h3>
              <ul className="text-gray-700 leading-relaxed mb-4 list-disc pl-6">
                <li>Payment must be made in full at the time of purchase</li>
                <li>We accept major credit cards, debit cards, and digital payment methods</li>
                <li>All transactions are processed securely through encrypted payment gateways</li>
                <li>You are responsible for ensuring your payment information is accurate and current</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refunds and Cancellations</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Customer Cancellations</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ticket refund policies vary by event and are set by the event organizer. Generally:
              </p>
              <ul className="text-gray-700 leading-relaxed mb-4 list-disc pl-6">
                <li>Refunds may be available up to 48 hours before the event date</li>
                <li>Processing fees are non-refundable</li>
                <li>Some events may have no-refund policies</li>
                <li>Special events or limited-capacity shows may have stricter policies</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Event Cancellations</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If an event is cancelled by the organizer, you will receive a full refund including all fees within 5-10 business days. For postponed events, your tickets remain valid for the new date, or you may request a refund within 30 days of the postponement announcement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To purchase tickets, you must create an account with accurate, complete, and current information. You are responsible for:
              </p>
              <ul className="text-gray-700 leading-relaxed mb-4 list-disc pl-6">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Immediately notifying us of any unauthorized use of your account</li>
                <li>Ensuring your contact information is current for important updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When using our platform, you agree not to:
              </p>
              <ul className="text-gray-700 leading-relaxed mb-4 list-disc pl-6">
                <li>Use automated systems (bots) to purchase tickets</li>
                <li>Resell tickets at prices above face value without authorization</li>
                <li>Share or transfer tickets without proper authorization</li>
                <li>Attempt to circumvent purchase limits or security measures</li>
                <li>Use the platform for any fraudulent or illegal activities</li>
                <li>Interfere with or disrupt the platform's operation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Event Attendance</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Entry Requirements</h3>
              <ul className="text-gray-700 leading-relaxed mb-4 list-disc pl-6">
                <li>Valid ticket and government-issued photo ID required for entry</li>
                <li>Some events may have additional age restrictions or requirements</li>
                <li>Venue security policies and local laws apply</li>
                <li>Late arrival may result in restricted entry until appropriate breaks</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Venue Policies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Each venue maintains its own policies regarding prohibited items, dress codes, and conduct. You agree to comply with all venue rules and local regulations. Violation may result in removal without refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Concerto acts as an intermediary between customers and event organizers. Our liability is limited to the purchase price of tickets. We are not responsible for:
              </p>
              <ul className="text-gray-700 leading-relaxed mb-4 list-disc pl-6">
                <li>Event quality, content, or performance issues</li>
                <li>Venue conditions, safety, or accessibility</li>
                <li>Transportation, accommodation, or other travel arrangements</li>
                <li>Personal injury or property damage at events</li>
                <li>Technical issues beyond our reasonable control</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our service, you consent to our data practices as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the platform after changes are posted constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@concerto.com</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> 1-800-CONCERT</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> 123 Music Plaza, Entertainment District, NY 10001</p>
                <p className="text-gray-700"><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM EST</p>
              </div>
            </section>

          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}
