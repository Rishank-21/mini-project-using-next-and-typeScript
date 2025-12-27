import authOptions from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/model/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const session = await getServerSession(authOptions)
        if(!session || !session?.user?.email || !session?.user?.id){
            return NextResponse.json(
                {message : "Unauthorized"},
                {status : 401}
            )
        }
        const user = await User.findById(session.user.id).select("-password")
        if(!user) return NextResponse.json({message : "User Not Found"},{status : 404})

            return NextResponse.json(
                user,
                {status : 200}
            )
    } catch (error) {
        return NextResponse.json(
            { message : error},
            {status : 500}
        )
    }
}