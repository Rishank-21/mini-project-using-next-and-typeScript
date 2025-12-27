import { connect } from "mongoose"


let mongodbUrl = process.env.MONGODB_URI 
if(!mongodbUrl){
    throw new Error("MONGODB_URI is not defined")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

export const connectDB = async () => {
    if(cached.conn) {
        
        return cached.conn
    }
    if(!cached.promise){
    cached.promise =  connect(mongodbUrl).then((c) => c.connection)
    }
    try {
        cached.conn = await cached.promise
       
    } catch (error) {
        throw error
    }
    return cached.conn
}