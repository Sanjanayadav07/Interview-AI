/*
import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => {
    try {
        let {token} = req.cookies

        if (!token) {
            return res.status(400).json({message: "user does not have a token"})
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!verifyToken) {
            return res.status(400).json({message: "user does not have a valid token"})
        }
        req.userId= verifyToken.userId
        next()
    } catch (error) {
        return res.status(500).json({message:`IsAuth error ${error}`})

    }
}

export default isAuth;
*/

import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    let token;

    // ✅ 1. Header se token lo
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ 2. Cookie fallback (optional)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    console.log("TOKEN =>", token); // 🔥 DEBUG

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED =>", decoded); // 🔥 DEBUG

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("AUTH ERROR =>", error.message); // 🔥 DEBUG
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;