import Hero from "@/components/hero";
import Header from "@/components/header";
import Main from "@/components/main";

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
