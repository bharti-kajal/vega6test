import mongoose from 'mongoose';
import 'dotenv/config';

const url = process.env.DATABASE_URL;

export const connectUsingMongoose = async () => {
    try{
        await mongoose.connect(url);
        console.log("Mongodb connected using mongoose");
    }catch(err){
        console.log("Error while connecting to db", err);
    }
}
