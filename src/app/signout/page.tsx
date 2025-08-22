"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "@/components/logo";

export default function SignoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasSignedOut, setHasSignedOut] = useState(false);

  // Slideshow state and images (same as other auth pages)
  const [currentSlide, setCurrentSlide] = useState(0);
  const bandImages = [
    "https://images.squarespace-cdn.com/content/577b72f0be65944fd9cd1574/1676640634859-8TQ5ER1DQIJJEK0QWJJ9/Banner+v1.png?content-type=image%2Fpng",
    "/Oasis.png",
    "https://arena-tour.co.uk/wp-content/uploads/2024/11/Lana-Del-Rey-UK-Tour-2025.webp",
    "https://smashingpumpkins.com/app/uploads/2025/03/032525_SmashingPumpkins_2025_TourPoster01c2.png",
    "https://pbs.twimg.com/media/GGye0DfXIAEdLnB?format=jpg&name=large",
    "https://www.nj.com/resizer/v2/UFPL3AM5QBEI5PP5ZU3I3MCTU4.jpg?auth=1b0bd7e14eb59cbd492b2294cbba74c31b60a81791424ab7f60b087654948e75&width=1280&quality=90",
    "https://live-production.wcms.abc-cdn.net.au/a8cfc89af5e9d0ee5a0ccd06e71496e4?impolicy=wcms_crop_resize&cropH=2042&cropW=3630&xPos=870&yPos=867&width=862&height=485"
  ];

  // Preload images for better performance
  useEffect(() => {
    bandImages.forEach((imageSrc) => {
      const img = new Image();
      img.src = imageSrc;
    });
  }, [bandImages]);

  // Slideshow effect - change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bandImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bandImages.length]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirect: false });
      setHasSignedOut(true);
      setIsSigningOut(false);
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // If user is not signed in, redirect to home
  useEffect(() => {
    if (!session && !isSigningOut && !hasSignedOut) {
      router.push("/");
    }
  }, [session, isSigningOut, hasSignedOut, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 relative overflow-hidden">
      {/* Dynamic slideshow background */}
      {bandImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${image}')`
          }}
        />
      ))}
      
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>
    
      {/* Content container */}
      <div className="w-full max-w-md relative z-20">
        <div className="text-center mb-8">
          <Logo color="white" className="my-10"/>
          {hasSignedOut ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg mb-2">
                See You Soon!
              </h1>
              <p className="text-white drop-shadow-md">
                You've been signed out successfully. Redirecting to home...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg mb-2">
                Sign Out
              </h1>
              <p className="text-white drop-shadow-md">
                Are you sure you want to sign out?
              </p>
            </div>
          )}
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-zinc-700/50">
          <div className="p-8">
            {hasSignedOut ? (
              <div className="text-center space-y-4">
                <div className="bg-green-900/30 border border-green-800/50 rounded-lg px-4 py-3 text-green-200 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-green-400 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Successfully signed out!</p>
                </div>
                
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-white text-sm">Redirecting...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {session && (
                  <div className="text-center text-zinc-300">
                    <p className="text-sm">Signed in as:</p>
                    <p className="font-medium text-white">{session.user?.email}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-zinc-900 disabled:opacity-50 transition-all duration-200"
                  >
                    {isSigningOut ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing out...
                      </div>
                    ) : (
                      "Yes, Sign Me Out"
                    )}
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={isSigningOut}
                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-900 disabled:opacity-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {!hasSignedOut && (
            <div className="px-8 py-4 bg-zinc-900/60 border-t border-zinc-700/50 flex flex-col sm:flex-row items-center justify-center">
              <Link
                href="/"
                className="text-sm text-zinc-500 hover:text-zinc-300"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
