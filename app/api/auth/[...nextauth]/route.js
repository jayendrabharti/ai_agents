import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    _callbacks: {
        async session({ session }) {

            const sessionUser = await User.findOne({
                email: session.user.email
            });

            session.user.id = sessionUser._id.toString();
            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDB();

                const userExists = await User.findOne({
                    email: profile?.email
                });

                if (!userExists) {
                    const user = await User.create({
                        email: profile?.email,
                        username: profile?.name.replace(" ", "").toLowerCase(),
                        image: profile?.image
                    });
                }
                return true;

            } catch (error) {
                console.log(error);
                return false;
            }
        }
    },
    get callbacks() {
        return this._callbacks;
    },
    set callbacks(value) {
        this._callbacks = value;
    },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST};