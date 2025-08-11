import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"


const createUser = async (payload: IUser) => {  
    const hashpassword=await bcryptjs.hash(payload.password as string,10)
    payload.password=hashpassword;
    const create = await User.create(payload)
    return create
}


export const userService = {
    createUser
}