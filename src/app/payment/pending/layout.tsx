import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Pending"
};

export default function PaymentPendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
