import jwt from 'jsonwebtoken';
const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization
    if (authHeader === null || authHeader === undefined) {
        return res.status(401).json({ status: 401, meassage: "UnAuthorized" });
    }
    // removing bearer word from token
    const token = authHeader.split(" ")[1];

}
// * Verify the JWT token
jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
        return res.status(401).json({ status: 401, message: "UnAuthorized" });
    // * if successfully authenticated then set the payload data(name, email, profile) in req.user
    req.user = user;
    next();

})
export default authMiddleware;
