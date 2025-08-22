"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import Logo from "@/components/logo";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/api/auth/signin";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Slideshow state and images
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

  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      setSuccess("Account created successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push(redirect);
      }, 2000);
    } catch (error) {
      setError("An unexpected error occurred");
      setIsLoading(false);
      console.error("Registration error:", error);
    }
  };

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
          <Logo    color="white"
                  className="my-10"/>

          <p className="text-white mt-2 drop-shadow-md">
            Join us and we'll show you cool the gigs around!
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-zinc-700/50">
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-red-200 flex items-start">
                <svg
                  className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-900/30 border border-green-800/50 rounded-lg px-4 py-3 text-green-200 flex items-start">
                <svg
                  className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-zinc-300 text-sm font-medium mb-2"
                >
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full bg-zinc-900/50 border border-zinc-700 rounded-lg py-2.5 px-4 text-white placeholder-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-zinc-300 text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full bg-zinc-900/50 border border-zinc-700 rounded-lg py-2.5 px-4 text-white placeholder-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-zinc-300 text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full bg-zinc-900/50 border border-zinc-700 rounded-lg py-2.5 px-4 text-white placeholder-zinc-500 shadow-sm focus:outline-none focus:ring-2 ocus:ring-white focus:border-white transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-zinc-300 text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full bg-zinc-900/50 border border-zinc-700 rounded-lg py-2.5 px-4 text-white placeholder-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-green-400 hover:text-white font-medium py-2.5 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ocus:ring-white focus:border-white disabled:opacity-50 transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

          </div>

          <div className="px-8 py-4 bg-zinc-900/60 border-t border-zinc-700/50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-green-400 hover:text-green-500 font-medium"
              >
                Sign In
              </Link>
            </p>
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-300 mt-2 sm:mt-0"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
