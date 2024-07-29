const jwt = require('jsonwebtoken');

// const jwtMiddleware = (req, res, next) => {
//     try {
//         const token = req.headers['access_token'];
//         if (!token) {
//             return res.status(401).json({
//                 status: false,
//                 message: 'Token is missing, please login',
//                 statusCode: 401,
//             });
//         }
        
//         jwt.verify(token, 'superkey123', (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({
//                     status: false,
//                     message: 'Token is invalid or expired, please login again',
//                     statusCode: 401,
//                 });
//             }
            
//             // Check if the token has expired
//             const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
//             if (decoded.exp && decoded.exp < currentTimestamp) {
//                 return res.status(401).json({
//                     status: false,
//                     message: 'Token has expired, please login again',
//                     statusCode: 401,
//                 });
//             }
            
//             // Token is valid
//             next();
//         });
//     } catch (error) {
//         res.status(401).json({
//             status: false,
//             message: 'Please Login',
//             statusCode: 401,
//         });
//     }
// };


const jwtMiddleware = (req, res, next) => {
    const tokenHeader = req.headers['access_token'];

    if (!tokenHeader) {
        return res.status(401).json("Authorization Failed! Token not provided");
    }

    const token = tokenHeader.split(" ")[1];

    try {
        const jwtResponse = jwt.verify(token, "superkey123");
        req.payload = jwtResponse._id;
        next();
    } catch (err) {
        res.status(401).json("Authorization Failed! Please login");
    }
};

module.exports=jwtMiddleware
module.exports = { jwtMiddleware };
