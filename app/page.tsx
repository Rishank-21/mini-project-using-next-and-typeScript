"use client"
import { signOut, useSession } from 'next-auth/react'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { BsPencilFill } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { userDataContext } from '@/context/UserContext';
function page() {
  const data = useContext(userDataContext)
  const [loading , setLoading] = useState(false)
  const router = useRouter()
  const handleSignOut = async () => {
    setLoading(true)
    try {
    await signOut()
    setLoading(false)
    } catch (error) {
      console.log(error)
    }
   
  }

  return (
    <div className='min-h-screen flex flex-col items-center bg-black justify-center text-white px-4'>
      {!data?.user && <div className='text-white text-3xl'> Loading....</div>}
      {data?.user && 
       <div className='w-full max-w-md border-2 border-white rounded-2xl p-8 shadow-lg text-center relative flex flex-col items-center'>
        <BsPencilFill size={22} color='white' className='absolute right-5 top-5 cursor-pointer' onClick={() => router.push("/edit")}/>
        {data.user.image && <div className='relative w-[200px] h-[200px] rounded-full border-2 border-white overflow-hidden mb-4'>
         <Image src={data.user.image} fill={true} alt="User Image" />
        </div>}

        <h1 className='text-2xl font-semibold my-4'>Welcome, {data.user.name}</h1>
        <button className='w-full py-2 px-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer' onClick={handleSignOut}>
          Sign Out
        </button>

      </div>
      }
    </div>
  )
}

export default page
