"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

// mock data
const carouselData = [
  {
    id: 1,
    image: "/oasis.png",
    title: "Oasis Live'25",
    subtitle: "The Long Awaited Reunion!",
    alt: "Concert Hero Image",
  },
  {
    id: 2,
    image: "/oasis.png",
    title: "Band lain",
    subtitle: "Find your favorite band in action!",
    alt: "Concert Hero Image",
  },
  {
    id: 3,
    image: "/kangenbanf.jpg",
    title: "Kangen Band",
    subtitle: "Find your favorite band in action!",
    alt: "Concert Hero Image",
  },
  {
    id: 4,
    image: "/oasis.png",
    title: "Band lain",
    subtitle: "Find your favorite band in action!",
    alt: "Concert Hero Image",
  },
  {
    id: 5,
    image: "/kangenbanf.jpg",
    title: "Kangen Band",
    subtitle: "Find your favorite band in action!",
    alt: "Concert Hero Image",
  },
  
];

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
    <section className="relative w-[90vw] h-[25vh] md:h-[25vh] lg:h-[30vh] xl:w-[80vw] xl:h-[30vh] mx-auto overflow-hidden shadow-lg">
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
            <div className="absolute inset-0 left-10 w-1/2 flex flex-col justify-center items-center z-10">
              <div className="text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-50 mb-4 drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white drop-shadow-md max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
                <button
                  className="text-shadow-sm text-white bg-white/30 backdrop-blur-md text-xs 
                md:text-xl lg:text-2xl drop-shadow-md max-w-2xl mx-auto my-4 px-3 py-2 rounded-md hover:bg-white/20 hover:backdrop-blur-xl hover:border-2 hover:border-white transition-all duration-100"
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
