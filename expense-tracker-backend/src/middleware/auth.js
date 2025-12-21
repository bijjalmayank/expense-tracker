import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"

    if (!token) return res.status(401).json({ message: "No token, auth denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: user._id }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};
