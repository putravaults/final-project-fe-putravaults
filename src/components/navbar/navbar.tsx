'use client'
import Link from "next/link"
import Navlink from "./navlink";
import Logo from "../logo";
 
const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-white shadow-sm z-50 md:px-10">
      <div className="max-w-screen mx-auto flex flex-wrap items-center justify-between p-4">
        <Link href="/">
            <div className="flex items-center justify-between space-x-5 transition-all duration-400">          
                <Logo 
                  color="green"
                  className="w-48 h-10 md:h-12 lg:w-56"
                />
            </div>
        </Link>
        <Navlink />
      </div>
    </div>
  );
};

export default Navbar