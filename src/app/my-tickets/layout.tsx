import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tickets"
};

export default function MyTicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
