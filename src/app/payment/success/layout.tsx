import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful"
};

export default function PaymentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
