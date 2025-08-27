import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing Concerto events, users, and platform content.",
  keywords: ["admin", "dashboard", "event management", "concerto admin", "platform management"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Admin Dashboard - Concerto",
    description: "Manage events and platform content",
    url: "https://concerto.com/admin",
  },
  twitter: {
    title: "Admin Dashboard - Concerto",
    description: "Manage events and platform content",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
