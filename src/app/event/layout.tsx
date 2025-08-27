import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details",
  description: "View detailed information about concerts and live events on Concerto. See event details, ticket availability, and pricing.",
  keywords: ["event details", "concert information", "ticket availability", "event pricing", "concert details"],
  openGraph: {
    title: "Event Details - Concerto",
    description: "View detailed information about concerts and live events.",
    url: "https://concerto.com/event",
  },
  twitter: {
    title: "Event Details - Concerto",
    description: "View detailed information about concerts and live events.",
  },
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
