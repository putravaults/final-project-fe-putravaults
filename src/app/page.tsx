import type { Metadata } from "next";
import Hero from "@/components/hero";
import Header from "@/components/header";
import Main from "@/components/main";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and book amazing concerts and live events with Concerto. Browse upcoming shows, secure your tickets, and create unforgettable memories.",
  keywords: ["concert tickets", "live events", "music concerts", "ticket booking", "upcoming concerts", "live music events"],
  openGraph: {
    title: "Concerto - Discover Amazing Concerts & Live Events",
    description: "Browse and book tickets for the best concerts and live events. Secure, reliable ticket booking platform.",
    url: "https://concerto.com",
  },
  twitter: {
    title: "Concerto - Discover Amazing Concerts & Live Events",
    description: "Browse and book tickets for the best concerts and live events.",
  },
};

export default function Home() {
  return (
    <div className="pt-20">
            {/* Header Section */}
            <Header />
      {/* Hero Section */}
      <Hero />


      {/* Events Section */}
      <section className="py-8">
        <Main />
      </section>
    </div>
  );
}
