import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import sequelize from "utils/db";
import bcrypt from 'bcryptjs'
import models from 'models'

const { Users } = models;

export default NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }

            },

            async authorize(credentials) {

                try {
                    await sequelize.sync();
                } catch {
                    throw new Error("Erro ao sincronizar com banco de dados");
                }

                const user = await Users.findOne({ where: { email: credentials.email } })

                if (user) {

                    if (await bcrypt.compare(credentials.password, user.password)) return {
                        ...user.get({ plain: true }),
                        keepConnected: credentials.keepConnected
                    };

                    throw new Error("Senha incorreta");

                }

                throw new Error("Usuário não encontrado");

            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
                token.keepConnected = user.keepConnected;
            }

            return token;
        },

        async session({ session, token }) {
            if (token && token.user) {
                session.user = token.user
                session.keepConnected = token.keepConnected;
            }

            session.maxAge = session.keepConnected ? 7 * 24 * 60 * 60 : 3600;

            return session;
        }
    },

    session: {
        strategy: "jwt",
        maxAge: 3600
    },

    jwt: {
        secret: process.env.JWT_SECRET,
    },

    pages: {
        signIn: '/'
    },
});

