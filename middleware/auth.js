import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function verifyJWT(req, res, next) {

    const header = req.header("Authorization");

    if (header != null) {

        const token = header.replace("Bearer ", "");

        try {

            const decoded = jwt.verify(token, process.env.JWT_KEY);

            req.user = decoded;

        } catch (err) {

            req.user = null;

        }

    }

    next();

}