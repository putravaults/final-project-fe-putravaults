import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read Concerto's terms and conditions for using our concert booking platform. Learn about ticket policies, refunds, user accounts, and more.",
  keywords: ["terms and conditions", "concerto terms", "booking terms", "ticket policies", "user agreement", "legal"],
  openGraph: {
    title: "Terms & Conditions - Concerto",
    description: "Read our terms and conditions for using the Concerto concert booking platform.",
    url: "https://concerto.com/terms",
  },
  twitter: {
    title: "Terms & Conditions - Concerto",
    description: "Read our terms and conditions for using the Concerto concert booking platform.",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
