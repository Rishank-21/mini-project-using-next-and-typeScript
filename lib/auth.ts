import { NextAuthOptions } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
    providers: [
        credentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: {label: "Password", type: "password" }
            },
            async authorize(credentials,req){
                let email = credentials?.email;
                let password = credentials?.password;
                if(!email || !password){
                    throw new Error('Email and Password are required')
                }
                await connectDB()
                let user = await User.findOne({email: email})
                if(!user) throw new Error("User does not exist")
                let isPasswordValid = await bcrypt.compare(password, user.password)
                if(!isPasswordValid) throw new Error("Invalid password")
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            }
        }),

        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {

        async signIn({account, user}){
            if(account?.provider === "google"){
                await connectDB();
                let existingUser = await User.findOne({email : user.email})
                if(!existingUser){
                     existingUser = await User.create({
                        name : user.name,
                        email: user.email
                    })
                }
                user.id=existingUser._id as string
            }
            return true
        },

        async jwt({token, user}){
            if(user){
                token.id = user.id;
                token.name = user.name
                token.email = user.email
                token.image = user.image
            }
            return token;
        },
        session({session, token}){
            if(session.user){
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
            }
            return session
        }
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 * 1000
    },
    pages: {
        signIn:'/login',
        error : '/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
}


export default authOptions;