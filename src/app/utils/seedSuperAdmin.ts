import { envVars } from "../config/env";
import { IAuthProvider, Role } from "../module/user/user.interface";
import { User } from "../module/user/user.model";
import bcryptjs from "bcryptjs"
export const seedSuperAdmin = async () => {

    try {
        const isSuperAdminExists = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isSuperAdminExists) {
            console.log("super admin already exists")
            return
        }

        const hashPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))
        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }
        const payload = {
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            role: Role.SUPER_ADMIN,
            auth: [authProvider],
            isVerified: true


        }
        const superAdmin = await User.create(payload)
        console.log("super Admin created successfully")
        
    } catch (error) {
        console.log(error);
    }

}