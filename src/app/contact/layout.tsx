import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: "Get in touch with Concerto's support team. We're here to help with booking issues, payment problems, account support, and any questions you may have.",
  keywords: ["contact concerto", "support", "help", "customer service", "booking support", "payment help", "contact us"],
  openGraph: {
    title: "Contact Concerto - Get Support & Help",
    description: "Need help? Contact our support team for assistance with bookings, payments, or any questions about Concerto.",
    url: "https://concerto.com/contact",
  },
  twitter: {
    title: "Contact Concerto - Get Support & Help",
    description: "Need help? Contact our support team for assistance with bookings, payments, or any questions about Concerto.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
