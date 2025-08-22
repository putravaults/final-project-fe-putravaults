"use client"

import { SessionProvider } from "next-auth/react";

const AuthProvider = ({children}:AuthProviderProps) =>{
    return <SessionProvider>{children}</SessionProvider>
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default AuthProvider