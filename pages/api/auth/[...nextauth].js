import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import sequelize from "utils/db";
import bcrypt from 'bcryptjs'
import models from 'models'

const { Users, Profiles, Functions, Modules, Transactions } = models;

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

                const user = await Users.findOne({ where: { email: credentials.email } })

                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    return user;
                } else {
                    throw new Error('E-mail ou senha inválida');
                }
            }
        })
    ],

    callbacks: {
        async jwt(token, user) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.profileId = user.profileId;
            }

            return token;
        },

        async session(session, token) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.profile = await Profiles.findOne({
                where: { id: token.profileId },
                include: [
                    { model: Functions, },
                    { model: Modules, },
                    { model: Transactions },
                ]
            });

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

