/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'via.placeholder.com',
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
        {
          protocol: 'https',
          hostname: 'example.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn.example.com',
        },

        {
          protocol: 'https',
          hostname: 'lafayettetimes.org',
        },
        // Hero carousel image hosts
        {
          protocol: 'https',
          hostname: 'images.squarespace-cdn.com',
        },
        {
          protocol: 'https',
          hostname: 'arena-tour.co.uk',
        },
        {
          protocol: 'https',
          hostname: 'smashingpumpkins.com',
        },
        {
          protocol: 'https',
          hostname: 'pbs.twimg.com',
        },
        {
          protocol: 'https',
          hostname: 'www.nj.com',
        },
        {
          protocol: 'https',
          hostname: 'live-production.wcms.abc-cdn.net.au',
        },
        
      ],
    },
  }
  
  module.exports = nextConfig