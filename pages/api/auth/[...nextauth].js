import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials) {
                
            }
        })
    ]
}) 

