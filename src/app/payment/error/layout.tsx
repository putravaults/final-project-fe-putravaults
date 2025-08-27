import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Error"
};

export default function PaymentErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
