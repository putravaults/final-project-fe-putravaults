'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  IoChevronDownOutline, 
  IoChevronUpOutline, 
  IoArrowBackOutline,
  IoTicketOutline,
  IoCardOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Booking & Tickets
  {
    id: 1,
    category: "Booking & Tickets",
    question: "How do I book tickets for a concert?",
    answer: "To book tickets, simply browse our upcoming events, select the concert you want to attend, choose your preferred ticket type and seats, and proceed to checkout. You'll need to create an account and provide payment information to complete your booking."
  },
  {
    id: 2,
    category: "Booking & Tickets",
    question: "Can I cancel or refund my tickets?",
    answer: "Ticket cancellation and refund policies vary by event. Generally, tickets can be refunded up to 48 hours before the event date, subject to a processing fee. Some events may have stricter no-refund policies. Please check the specific event terms during booking."
  },
  {
    id: 3,
    category: "Booking & Tickets",
    question: "How will I receive my tickets?",
    answer: "All tickets are delivered electronically via email as PDF attachments. You can also access your tickets through your account dashboard. We recommend downloading the tickets to your phone for easy access at the venue."
  },
  {
    id: 4,
    category: "Booking & Tickets",
    question: "Is there a limit on how many tickets I can buy?",
    answer: "Yes, there's typically a limit of 8 tickets per transaction to ensure fair access for all fans. Some high-demand events may have lower limits. The specific limit will be displayed during the booking process."
  },
  
  // Payment & Pricing
  {
    id: 5,
    category: "Payment & Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and digital wallets like Apple Pay and Google Pay. All transactions are processed securely through encrypted payment gateways."
  },
  {
    id: 6,
    category: "Payment & Pricing",
    question: "Are there any additional fees?",
    answer: "Yes, a small convenience fee (typically 3-5% of ticket price) and processing fee may apply. These fees cover payment processing and platform maintenance costs. All fees are clearly displayed before you complete your purchase."
  },
  {
    id: 7,
    category: "Payment & Pricing",
    question: "Why do ticket prices vary?",
    answer: "Ticket prices depend on several factors including seat location, demand, artist popularity, venue capacity, and production costs. Premium seats closer to the stage typically cost more than general admission or seats further away."
  },
  
  // Event Information
  {
    id: 8,
    category: "Event Information",
    question: "What should I bring to the concert?",
    answer: "Bring your ticket (digital or printed), valid photo ID, and any personal items you need. Check the venue's specific guidelines for prohibited items. Most venues don't allow professional cameras, outside food/drinks, or large bags."
  },
  {
    id: 9,
    category: "Event Information",
    question: "What time should I arrive at the venue?",
    answer: "We recommend arriving 30-60 minutes before the show starts to allow time for parking, security checks, and finding your seats. Check your ticket for specific door opening times, which are usually 1-2 hours before the show."
  },
  {
    id: 10,
    category: "Event Information",
    question: "What happens if an event is cancelled or postponed?",
    answer: "If an event is cancelled, you'll receive a full refund automatically within 5-10 business days. For postponed events, your tickets remain valid for the new date. If you can't attend the new date, you may request a refund within 30 days of the announcement."
  },
  
  // Account & Support
  {
    id: 11,
    category: "Account & Support",
    question: "Do I need to create an account to buy tickets?",
    answer: "Yes, creating an account is required for ticket purchases. This allows you to access your order history, receive important event updates, and manage your tickets easily. Account creation is free and takes just a minute."
  },
  {
    id: 12,
    category: "Account & Support",
    question: "I forgot my password. How can I reset it?",
    answer: "Click on the 'Sign In' button and then select 'Forgot Password'. Enter your email address and we'll send you a password reset link. If you don't receive the email within a few minutes, check your spam folder."
  },
  {
    id: 13,
    category: "Account & Support",
    question: "How can I contact customer support?",
    answer: "You can reach our customer support team through multiple channels: email us at support@concerto.com, call us at 1-800-CONCERT, or use the live chat feature on our website. Our support hours are Monday-Friday 9AM-8PM and weekends 10AM-6PM."
  }
];

const categories = [...new Set(faqData.map(item => item.category))];
const categoryIcons: { [key: string]: React.ReactNode } = {
  "Booking & Tickets": <IoTicketOutline className="w-5 h-5" />,
  "Payment & Pricing": <IoCardOutline className="w-5 h-5" />,
  "Event Information": <IoLocationOutline className="w-5 h-5" />,
  "Account & Support": <IoPersonOutline className="w-5 h-5" />
};

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = selectedCategory 
    ? faqData.filter(item => item.category === selectedCategory)
    : faqData;

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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about booking tickets, attending events, and using our platform.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <IoShieldCheckmarkOutline className="w-4 h-4" />
              All Questions
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {categoryIcons[category]}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {categoryIcons[item.category]}
                      <span className="text-sm font-medium text-green-600">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.question}
                    </h3>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {openItems.has(item.id) ? (
                      <IoChevronUpOutline className="w-5 h-5 text-gray-500" />
                    ) : (
                      <IoChevronDownOutline className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </button>
              
              {openItems.has(item.id) && (
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-green-800 mb-6">
            Our support team is here to help! Get in touch with us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <IoPersonOutline className="w-5 h-5" />
              Contact Support
            </Link>
            <a
              href="mailto:support@concerto.com"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-green-600 border border-green-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
