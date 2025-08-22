import { useSession } from "next-auth/react"
import Link from "next/link"

export const SignInButton = () => {
    const {data:session} = useSession()

    if (session && session.user) return (
        <div className="group relative flex items-center">
            <span className="py-2 px-3 bg-green-800 text-white rounded-sm cursor-pointer">
                {session.user.email.split('@')[0]}
            </span>
            <Link 
                href="/signout" 
                className="py-2 px-3 bg-red-600 text-white hover:bg-red-700 rounded-sm ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                Sign Out
            </Link>
        </div>
    )

    return (
        <div className="flex gap-2 items-center justify-center">
            <Link 
                href="/signin" 
                className="block py-2 px-3 bg-gradient-to-b from-green-700/90 to-green-900  text-white hover:bg-white hover:drop-shadow-md  rounded-sm">
                Sign In
            </Link>  
            <span className="lowercase"> Or </span>
            <Link 
                href="/signup" 
                className="block py-2 px-3 bg-gradient-to-b from-green-700/90 to-green-900 text-white hover:bg-white hover:drop-shadow-md rounded-sm">
                Sign Up
            </Link>  
        </div>   
    ) 
}

