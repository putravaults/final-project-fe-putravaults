export default function Header() {
  return (
    <section className="py-12 ">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Main heading */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 text-shadow-lg">
          Experience Music
          <span className="block text-green-800 mt-1">Outside Your Headphone</span>
        </h1>
        
        {/* Subheading */}
        <p className="text-base  md:text-md text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          From intimate venues to grand stadiums, discover unforgettable concerts 
          featuring your favorite artists. Book your tickets now and create memories that last a lifetime.
        </p>

        {/* Feature highlights - more compact */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Variety of Artists</h3>
            <p className="text-gray-600 text-xs">World-class performers across all genres</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Secure Booking</h3>
            <p className="text-gray-600 text-xs">Safe and instant ticket booking</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Prime Venues</h3>
            <p className="text-gray-600 text-xs">Excellent acoustics and atmosphere</p>
          </div>
        </div>
      </div>
    </section>
  )
}
