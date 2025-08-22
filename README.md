# Concert Ticket Booking Frontend

A modern, responsive web application for booking concert tickets built with Next.js 15, React 19, and TypeScript.

## 🎯 Overview

This frontend application provides a seamless ticket booking experience for concert events. Users can browse events, purchase tickets, and manage their bookings, while administrators can create and manage events through a comprehensive dashboard.

## ✨ Features

### For Users
- 🔐 **Authentication** - Secure login/signup with GitHub OAuth
- 🎫 **Event Browsing** - Browse and search available concerts
- 💳 **Ticket Booking** - Purchase tickets with integrated payment processing
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 📋 **Booking Management** - View booking history and download tickets

### For Administrators
- 🎪 **Event Management** - Create, edit, and delete events
- 🎟️ **Ticket Management** - Generate and manage ticket availability
- 📊 **Dashboard** - Comprehensive admin dashboard with analytics
- 💰 **Payment Processing** - Integrated Midtrans payment gateway

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js 4.24.11
- **Payment**: Midtrans Integration
- **Package Manager**: pnpm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd concert-ticket-booking
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   MIDTRANS_SERVER_KEY=your-midtrans-server-key
   MIDTRANS_CLIENT_KEY=your-midtrans-client-key
   API_BASE_URL=http://localhost:3001
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── event/             # Event pages
│   ├── payment/           # Payment result pages
│   └── auth/              # Authentication pages
├── components/            # Reusable components
│   ├── navbar/            # Navigation
│   ├── modals/            # Modal components
│   └── ui/                # UI components
├── lib/                   # Utilities
│   ├── api.ts             # API client
│   ├── auth.ts            # Auth utilities
│   └── types.ts           # TypeScript types
└── contexts/              # React contexts
```

## 🎨 Key Components

- **AuthProvider** - Authentication context provider
- **Navbar** - Responsive navigation with user status
- **EventCards** - Display event information
- **PaymentButton** - Midtrans payment integration
- **AdminDashboard** - Comprehensive admin interface
- **CreateEventModal** - Event creation form
- **TicketPurchaseCard** - Ticket selection interface

## 🔗 API Integration

The frontend connects to a NestJS backend API with endpoints for:
- **Authentication** - User registration and login
- **Events** - CRUD operations for events
- **Tickets** - Ticket management and reservation
- **Bookings** - Booking creation and management

## 🔐 Authentication

- **NextAuth.js** for session management
- **JWT tokens** for stateless authentication
- **Protected routes** for admin and user areas

## 💳 Payment Integration

- **Midtrans** payment gateway
- **Multiple payment methods** (cards, bank transfer, e-wallets)
- **Secure payment processing**
- **Webhook handling** for payment status updates

## 📱 Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** for styling
- **Flexible layouts** for all screen sizes
- **Touch-friendly** interfaces

## 🚀 Deployment

### Build for Production
```bash
pnpm build
pnpm start
```

### Deploy to Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

## 🛠️ Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

## 🧪 Testing

The project includes comprehensive unit tests with Jest and React Testing Library:

- **Unit Tests** - Core functions and utilities
- **Component Tests** - React component rendering and interactions
- **API Tests** - Backend integration and error handling
- **Integration Tests** - End-to-end functionality

Run tests with:
```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

Current test coverage target: **20%**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Check the [FAQ page](/faq)
- Review the [API documentation](../concerto-backend/API_DOCUMENTATION.md)
- Submit an issue on GitHub

---

**Built with ❤️ using Next.js, React, and TypeScript**
