import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Find answers to frequently asked questions about booking concerts, payment methods, ticket policies, and more on Concerto.",
  keywords: ["FAQ", "frequently asked questions", "concert booking help", "ticket policies", "payment methods", "support"],
  openGraph: {
    title: "FAQ - Frequently Asked Questions",
    description: "Get answers to common questions about booking concerts and using Concerto.",
    url: "https://concerto.com/faq",
  },
  twitter: {
    title: "FAQ - Frequently Asked Questions",
    description: "Get answers to common questions about booking concerts and using Concerto.",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
