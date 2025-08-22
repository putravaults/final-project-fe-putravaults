import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
    user: {
        id: number,
        name: string|null,
        email: string,
        registeredAt: string,
        role: string
    };
    accessToken: string;
    refreshToken: string;
}

}

import {JWT} from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: number,
            name: string|null,
            email: string,
            registeredAt: string,
            role: string
        };
        accessToken: string;
        refreshToken: string;
    }
}