const jwt = require('jsonwebtoken')

const isAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const accesToken = authHeader && authHeader.split(" ")[1]
    if(!accesToken){
        return res.status(401).json({succes: false, message: 'No access token'})
    }
    try{
        const decoded = jwt.verify(accesToken, process.env.ACCESS_TOKEN_SECRET_KEY)
        if(decoded.role !== 'admin'){
            return res.status(403).json({success: false, message: 'Admin privileges required'})
        }
        req.user = decoded
         next()
    }catch{
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}

module.exports = {isAdmin}