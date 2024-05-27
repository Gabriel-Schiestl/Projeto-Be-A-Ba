import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import sequelize from "utils/db";
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials) {
                try {
                    await sequelize.sync();
                } catch {
                    console.error("Error syncing database");
                    return null;
                }

                const user = await User.findOne({where: {email: credentials.email}})

                if(user && bcrypt.compareSync(credentials.password, user.password)) {
                    return user;
                } else {
                    throw new Error('E-mail ou senha inválida');
                }
            }
        })
    ],

    callbacks: {
        async jwt(token, user) {
            if(user) {
                token.id = user.id;
                token.email = user.email;
                token.profile = user.profile;
            }

            return token;
        }, 

        async session(session, token) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.profile = token.profile;

            return session;
        }
    },

    session: {
        jwt: true,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
    }
}); 

