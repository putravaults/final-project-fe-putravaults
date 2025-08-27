import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import AuthProvider from "@/components/AuthProvider";
import MidtransScriptLoader from "@/components/MidtransScriptLoader";

const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Concerto - Premium Concert Booking Platform",
    template: "%s | Concerto"
  },
  description: "Book your favorite concerts and live events with Concerto. Secure, reliable, and user-friendly concert ticket booking platform.",
  keywords: ["concert tickets", "live events", "music concerts", "ticket booking", "live music", "event tickets"],
  authors: [{ name: "Concerto Team" }],
  creator: "Concerto",
  publisher: "Concerto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://concerto.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://concerto.com',
    title: 'Concerto - Premium Concert Booking Platform',
    description: 'Book your favorite concerts and live events with Concerto. Secure, reliable, and user-friendly concert ticket booking platform.',
    siteName: 'Concerto',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concerto - Premium Concert Booking Platform',
    description: 'Book your favorite concerts and live events with Concerto.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.variable} antialiased`}
      >
        <AuthProvider>
          <MidtransScriptLoader />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
