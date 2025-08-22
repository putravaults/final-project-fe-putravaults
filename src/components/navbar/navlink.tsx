'use client'
import { useState } from "react"
import {IoClose, IoMenu} from "react-icons/io5"
import clsx from "clsx";
import Link from "next/link";
import { SignInButton } from "../SigninButton";
import { useSession } from "next-auth/react";

export default function Navlink () {
  const [open, setOpen] = useState(false);
  const {data:session} = useSession()
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center text-sm text-gray-500 rounded-md md:hidden"
      >
        {!open ? <IoMenu className="size-8" /> : <IoClose className="size-8" />}
      </button>

             <div
         className={clsx("w-full md:flex md:w-auto", { hidden: !open })}
       >
        <ul className="flex flex-col font-semibold text-sm uppercase p-4 mt-4 rounded-sm bg-gray-50 
        md:text-xs lg:text-sm md:flex-row md:items-center md:space-x-1 md:p-0 md:mt-0 md:border-0 md:bg-white">
            {/* Admin Dashboard - Only visible to admin users */}
            {session && session.user && session.user.role === 'ADMIN' && (
              <li>
                  <Link 
                      href="/admin" 
                      className="block py-2 px-3 text-gray-800 bg-green-200 hover:bg-gray-100 rounded-sm">
                      Admin Dashboard
                  </Link>
              </li>
            )}
            
            {/* My Tickets - Visible to all authenticated users */}
            {session && session.user && (
              <li>
                  <Link 
                      href="/my-tickets" 
                      className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm">
                      My Tickets
                  </Link>
              </li>
            )}
            <li className="pt-2 md:pt-0">
                <SignInButton/>
            </li>
        </ul>
      </div>
    </>
  );
};