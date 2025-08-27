import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Concerto's mission to connect music lovers with unforgettable live experiences. Discover our story, values, and the team behind the platform.",
  keywords: ["about concerto", "concert booking company", "music platform", "live events", "team", "mission", "values"],
  openGraph: {
    title: "About Concerto - Our Story & Mission",
    description: "Discover how Concerto is revolutionizing concert booking and connecting music lovers with amazing live experiences.",
    url: "https://concerto.com/about",
  },
  twitter: {
    title: "About Concerto - Our Story & Mission",
    description: "Discover how Concerto is revolutionizing concert booking and connecting music lovers with amazing live experiences.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
