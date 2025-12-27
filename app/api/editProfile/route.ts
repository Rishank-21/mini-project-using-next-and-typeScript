import authOptions from "@/lib/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import User from "@/model/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request : NextRequest){
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if(!session || !session?.user?.email || !session?.user?.id){
      return NextResponse.json(
        {message : "Unauthorized"},
        {status : 401}
      )
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const file = formData.get("file") as Blob | null
    let imageUrl;
    if(file){
      imageUrl = await uploadOnCloudinary(file)
    }
    const user = await User.findByIdAndUpdate(session.user.id, { name , image : imageUrl}, {new : true})
    if(!user) return NextResponse.json({message : "User Not Found"},{status : 404}) 


      return NextResponse.json(
        user, 
        { status : 200}
      )

  } catch (error) {
    return NextResponse.json(
      { message : error},
      { status : 500}
    )
  }
}