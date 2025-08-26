declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXTAUTH_SECRET:string
        NEXT_PUBLIC_AUTH_URL:string
        
        //Backend API URL
        NEXT_PUBLIC_BACKEND_URL:string
        
        //Midtrans Configuration
        NEXT_PUBLIC_MIDTRANS_CLIENT_KEY:string
        MIDTRANS_SERVER_KEY:string
      }
    }
  }
  export {}