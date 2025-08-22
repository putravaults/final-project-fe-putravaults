import Link from "next/link";
import Logo from "./logo";
import { FaFacebook, FaInstagram, FaSquareXTwitter, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer 
      className="relative bg-green-900"
      style={{
        backgroundImage: "url('/footer-backdrop.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Green overlay for better text readability */}
      <div className="absolute inset-0 bg-green-900/75"></div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 w-full py-10 md:py-16 ">
        <div className="grid lg:grid-cols-4 gap-7 ">

          {/* column 1*/}
          <div className="">
            <Link href="/" className="mb-10 block">
              <Logo 
                color="white"
                className="w-48 h-10 md:h-12 lg:w-56"
              />
            </Link>
            <p className="text-gray-50 text-justify">Concerto. is a platform for you to find your favorite concerts. 
              We are a team of music lovers who are passionate about music, we understand that music is a powerful tool for communication and expression. 
              We are here to connect you with the best live music experience.
            </p>
          </div>
          
          {/* column 2*/}
          <div className="flex gap-20 justify-center">
            <div className="flex-1 lg:flex-none">
              <h4 className="mb-8 font-semibold text-gray-50 border-b border-gray-50 md:text-xl md:pb-2 md:border-none">LINKS</h4>
              <ul className="space-y-5 text-gray-50">
                <li>
                  <Link href="/">Home</Link>
                </li> 
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/tnq">Terms and Conditions</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* column 3*/}
          <div className="flex gap-20 justify-center">
            <div className="flex-1 lg:flex-none">
              <h4 className="mb-8 font-semibold text-gray-50 border-b border-gray-50 md:text-xl md:pb-2 md:border-none">REACH US!</h4>
              <ul className="space-y-5 text-gray-50">

                <li>
                  <Link href="/contact">Contact and Support</Link>
                </li>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* column 4*/}
          <div className="flex gap-20 justify-center">
            <div className="flex-1 lg:flex-none">
              <h4 className="mb-8 font-semibold text-gray-50 border-b border-gray-50 md:text-xl md:pb-2 md:border-none">FOLLOW US!</h4>
              <ul className="space-y-5 text-gray-50">
                <li>
                  <Link href="/" className="flex items-center gap-2"><FaInstagram /><span>Instagram</span></Link>
                </li>
                <li>
                  <Link href="/" className="flex items-center gap-2"><FaSquareXTwitter /><span className="text-bold">X</span></Link>
                </li>
                <li>
                  <Link href="/" className="flex items-center gap-2"><FaTiktok /><span>Tiktok</span></Link>
                </li>
                <li>
                  <Link href="/" className="flex items-center gap-2"><FaFacebook /><span>Facebook</span></Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="relative z-10 max-w-svw w-11/12 mx-auto px-4 border-t border-gray-300 py-4 text-center text-base text-gray-50">
        &copy; Copyright 2025 | UngkeVault-Revou
      </div>

    </footer>
  );
}
