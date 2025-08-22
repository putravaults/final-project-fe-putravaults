// @ts-nocheck
import { Backend_URL } from "@/lib/constant"
import type {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials: {
                email: {
                  label: "Email",
                  type: "email",
                  placeholder: "john@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                const {email, password} = credentials

                const res = await fetch(Backend_URL + "/auth/login", {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (res.status === 401) {
                    return null
                }
                const user = await res.json()
                return user
            }
        })
    ],

    pages: {
        signIn: '/signin',
        signOut: '/signout',
    },

    secret: process.env.NEXTAUTH_SECRET,
    
    callbacks:{
        async jwt({token, user}) {
            if(user) {
                // Map backend response to token structure
                // The user object from authorize() contains the full backend response
                const backendUser = user as any;
                return {
                    ...token,
                    user: backendUser.user,
                    accessToken: backendUser.accessToken,
                    refreshToken: backendUser.refreshToken
                }
            }
            return token
        },
        async session({token, session}) {
            session.user = token.user 
            session.accessToken = token.accessToken 
            session.refreshToken = token.refreshToken
            return session
        }
    }
}
