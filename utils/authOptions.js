import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "./database";
import User from "@/models/user";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async session({ session }) {
            await connectToDB();
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
    secret: process.env.NEXTAUTH_SECRET
};
