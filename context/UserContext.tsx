"use client"

import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { createContext, useContext, useEffect, useState } from 'react'

type UserDataContextType = {
    user: UserType | null,
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>
}

type UserType = {
    name : string,
    email : string,
    id : string,
    image?: string
}


export const userDataContext = createContext<UserDataContextType | undefined>(undefined)

const UserContext = ({children}: {children: React.ReactNode}) => {
    const [user , setUser] = useState<UserType | null>(null)
    const session = useSession()

    const data = {
        user , setUser
    }

  
    useEffect(() => {
        async function getUser(){
            try {
                const result = await axios.get('/api/user')
                setUser(result.data)

            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [session])

  return (
    <userDataContext.Provider value={data}>
        {children}
    </userDataContext.Provider>
  )
}

export default UserContext
