import { connectDB } from "@/lib/db";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        const { name , email, password } = await request.json()
        await connectDB()
        const isAlreadyExist = await User.findOne({ email })
        if(isAlreadyExist) return NextResponse.json({message : "user already exist please login"}, {status : 400})
        if(password.length < 6) return NextResponse.json({ message : "password must be atleast 6 characters long"}, {status : 400})

        
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email, 
            password : hashPassword,
        })
        
        return NextResponse.json(user, {status : 201})
        
    } catch (error) {
        return NextResponse.json({ message : error}, { status : 500})
    }
}