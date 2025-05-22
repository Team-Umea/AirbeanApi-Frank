import { dbReqisterAcc } from "../models/account.model.js";
import bcrypt from "bcrypt"
const createAccount = async (req,res) =>{
    const {
            profile_picture,
            firstname,
            surname,
            phone_number,
            address,
            post_number,
            city,
            email,
            password
        } = req.body;
        
        

        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            const account = await dbReqisterAcc(profile_picture,
            firstname,
            surname,
            phone_number,
            address,
            post_number,
            city,
            email,
            hashedPassword);
            res.status(201).json(account);

        }catch (err) {
            console.error("Error during account registration:", err);
            res.status(500).json({ error: 'Database error' });
    }
}
export default createAccount