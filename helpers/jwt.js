const jwt = require('jsonwebtoken');


const generarJWT = (uid) => {
    return new Promise( (resolve, reject) => {
        payload = {
            uid
        }
        jwt.sign( payload,  process.env.JWT_KEY, {
            expiresIn: '24h'
        }, ( err, token) => {
            if (err) {
                reject('no se pudo generar jwt')
            } else {
                resolve(token)
            }
        });
    })
}

module.exports = {
    generarJWT
}