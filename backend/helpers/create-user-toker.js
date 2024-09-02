const jwt = require('jsonwebtoken')

const creatUserToken = async (user, req, res) => {

    //creat a token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "nossosecret")

    // return token
    res.status(200).json({
        message: "autenticação concedida!",
        token: token,
        userId: user._id,

    })

}

module.exports = creatUserToken