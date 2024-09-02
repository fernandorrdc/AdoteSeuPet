const multer = require('multer')
const path = require('path')

//Destination to store the imagens

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {

        let folder = ""

        console.log(req)

        if (req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('pets')) {
            folder = 'pets'
        }
        cb(null, `public/images/${folder}/`)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + 
        String(Math.floor(Math.random() * 1000)) +
        path.extname(file.originalname))
    },

})
const imageUpload = multer ({
    storage : imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('só aceitamos imagens com extensões .jpg e .png'))
            
        }
        cb(undefined, true)
    },
})
module.exports = { imageUpload }