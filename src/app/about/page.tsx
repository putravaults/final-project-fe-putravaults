'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  IoArrowBackOutline,
  IoMusicalNotesOutline,
  IoRocketOutline,
  IoHeartOutline,
  IoShieldCheckmarkOutline,
  IoStarOutline,
  IoPlayCircleOutline,
  IoPeopleOutline,
  IoTrophyOutline,
  IoPersonOutline
} from 'react-icons/io5';

export default function AboutPage() {
  const stats = [
    { icon: <IoPlayCircleOutline className="w-8 h-8" />, value: "500K+", label: "Events Hosted" },
    { icon: <IoPeopleOutline className="w-8 h-8" />, value: "2M+", label: "Happy Customers" },
    { icon: <IoTrophyOutline className="w-8 h-8" />, value: "1000+", label: "Partner Venues" },
    { icon: <IoStarOutline className="w-8 h-8" />, value: "4.9", label: "Average Rating" }
  ];

  const values = [
    {
      icon: <IoMusicalNotesOutline className="w-12 h-12" />,
      title: "Music First",
      description: "We believe music has the power to bring people together and create unforgettable experiences. Every decision we make puts the music and the fans first."
    },
    {
      icon: <IoShieldCheckmarkOutline className="w-12 h-12" />,
      title: "Trust & Security",
      description: "Your trust is our foundation. We use industry-leading security measures to protect your data and ensure safe, reliable ticket transactions."
    },
    {
      icon: <IoHeartOutline className="w-12 h-12" />,
      title: "Customer Care",
      description: "We're passionate about providing exceptional customer service. Our dedicated support team is here to help make your concert experience perfect."
    },
    {
      icon: <IoRocketOutline className="w-12 h-12" />,
      title: "Innovation",
      description: "We continuously improve our platform with cutting-edge technology to make discovering and booking concerts easier and more enjoyable."
    }
  ];

  const team = [
    {
      name: "Hendra Setang",
      role: "CEO & Founder",
      image: "/team/sarah.jpg", // You'll need to add actual team photos
      bio: "Former music industry executive with 15 years of experience in event management and technology."
    },
    {
      name: "Fajar",
      role: "CTO",
      image: "/team/michael.jpg",
      bio: "Software architect passionate about building scalable platforms that connect artists with their fans."
    },
    {
      name: "Frenky",
      role: "Head of Partnerships",
      image: "/team/emily.jpg",
      bio: "Music industry veteran focused on building relationships with venues, artists, and promoters worldwide."
    },
    {
      name: "Perdi Pengkol",
      role: "Head of Customer Success",
      image: "/team/david.jpg",
      bio: "Customer experience expert dedicated to ensuring every fan has an amazing concert-going experience."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-green-800 hover:text-green-900 font-medium"
            >
              <IoArrowBackOutline className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Concerto
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connecting music lovers with unforgettable live experiences since 2018.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-800 to-green-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Bringing Music to Life
              </h2>
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                At Concerto, we believe that live music has the power to transform lives, create communities, and build lasting memories. Since our founding in 2018, we've been dedicated to making it easier than ever for music fans to discover and attend the concerts they love.
              </p>
              <p className="text-lg text-green-200 leading-relaxed">
                From intimate acoustic sets to massive festival experiences, we're here to help you find your next musical adventure.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <div className="w-full h-80 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <IoMusicalNotesOutline className="w-24 h-24 text-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center text-green-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                Concerto was born from a simple frustration: buying concert tickets shouldn't be complicated, expensive, or unreliable. Our founders, passionate music fans themselves, experienced firsthand the challenges of navigating multiple ticketing platforms, dealing with hidden fees, and worrying about ticket authenticity.
              </p>
              <p className="mb-6">
                In 2018, we set out to create a better way. We envisioned a platform that would be transparent about pricing, secure in its transactions, and genuinely focused on enhancing the fan experience rather than just selling tickets.
              </p>
              <p>
                Today, Concerto has grown into a trusted platform serving millions of music fans worldwide. We've partnered with thousands of venues, artists, and promoters to bring you the best in live music entertainment, from local club shows to international stadium tours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((value, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the passionate team behind Concerto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <IoPersonOutline className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-green-100 mb-8">
              "To make live music accessible to everyone by providing a trusted, transparent, and user-friendly platform that connects fans with the artists and experiences they love."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-0.5 bg-green-400"></div>
              <IoHeartOutline className="w-8 h-8 text-green-400" />
              <div className="w-16 h-0.5 bg-green-400"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about our platform or want to partner with us? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:hello@concerto.com"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-green-600 border border-green-600 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              hello@concerto.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
