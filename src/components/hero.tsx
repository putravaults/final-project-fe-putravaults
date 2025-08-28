"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

// carousel images sourced from signup page list
const bandImages: string[] = [
  "https://images.squarespace-cdn.com/content/577b72f0be65944fd9cd1574/1676640634859-8TQ5ER1DQIJJEK0QWJJ9/Banner+v1.png?content-type=image%2Fpng",
  "/Oasis.png",
  "https://arena-tour.co.uk/wp-content/uploads/2024/11/Lana-Del-Rey-UK-Tour-2025.webp",
  "https://smashingpumpkins.com/app/uploads/2025/03/032525_SmashingPumpkins_2025_TourPoster01c2.png",
  "https://pbs.twimg.com/media/GGye0DfXIAEdLnB?format=jpg&name=large",
  "https://www.nj.com/resizer/v2/UFPL3AM5QBEI5PP5ZU3I3MCTU4.jpg?auth=1b0bd7e14eb59cbd492b2294cbba74c31b60a81791424ab7f60b087654948e75&width=1280&quality=90",
  "https://live-production.wcms.abc-cdn.net.au/a8cfc89af5e9d0ee5a0ccd06e71496e4?impolicy=wcms_crop_resize&cropH=2042&cropW=3630&xPos=870&yPos=867&width=862&height=485",
];

const carouselData = bandImages.map((url, index) => ({
  id: index + 1,
  image: url,
  title: "Live Music Awaits",
  subtitle: "Find your favorite artists in action!",
  alt: `Carousel Image ${index + 1}`,
}));

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!autoAdvance) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoAdvance]);

  // Reset auto-advance timer when manually navigating
  const resetTimer = () => {
    setAutoAdvance(false);
    setTimeout(() => setAutoAdvance(true), 100); // Brief pause then restart timer
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetTimer();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    resetTimer();
  };

  return (
    <section className="relative w-[95vw] h-[28vh] sm:h-[30vh] md:h-[35vh] lg:h-[40vh] xl:w-[85vw] xl:h-[45vh] mx-auto overflow-hidden shadow-lg">
      {/* Carousel Container */}
      <div className=" relative w-full h-full">
        {/* Individual Carousel Cards */}
        {carouselData.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? "translate-x-0" : 
              index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            {/* Responsive Image Container */}
            <div className="relative w-full h-full ">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 to-green-700/10"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 left-0 w-full sm:left-6 sm:w-[85%] lg:left-10 lg:w-1/2 flex flex-col justify-center items-center z-10">
              <div className="text-center px-3 sm:px-6 md:px-8 max-w-4xl mx-auto">
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-50 mb-2 sm:mb-3 md:mb-4 drop-shadow-lg leading-tight">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white drop-shadow-md max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
                <button
                  className="text-shadow-sm text-white bg-white/30 backdrop-blur-md text-sm sm:text-base md:text-lg drop-shadow-md max-w-2xl mx-auto my-3 sm:my-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md hover:bg-white/20 hover:backdrop-blur-xl hover:border hover:border-white transition-all duration-100"
                >
                  See Available Tickets
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Dots (for future API implementation) */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {carouselData.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Navigation Arrows (for future API implementation) */}
        {carouselData.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
