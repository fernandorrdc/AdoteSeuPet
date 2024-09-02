
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const getToken = require('../helpers/get-token')
const creatUserToken = require('../helpers/create-user-toker')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {
   static async register(req, res) {
      const { name, email, phone, password, confirmpassword } = req.body

      //validations

      if (!name) {
         res.status(422).json({ message: 'O nome é obrigatório!' })
         return
      }

      if (!email) {
         res.status(422).json({ message: 'O Email é obrigatório!' })
         return
      }

      if (!phone) {
         res.status(422).json({ message: 'O Telefone é obrigatório!' })
         return
      }

      if (!password) {
         res.status(422).json({ message: 'A senha é obrigatória!' })
         return
      }

      if (!confirmpassword) {
         res.status(422).json({ message: 'CONFIRME SENHA é obrigatório!' })
         return
      }

      if (password !== confirmpassword) {
         res.status(422).json({ message: 'Senha diferente de sua confirmação de senha!' })
         return
      }

      //check if user exists

      const userExists = await User.findOne({ email: email })

      if (userExists) {
         res.status(422).json({ message: 'Digite outro email, esse já está cadastrado ' })
         return

      }
      // create  a Password 
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      //creat a user

      const user = new User({
         name,
         email,
         phone,
         password: passwordHash,

      })

      try {
         const newUser = await user.save()
         await creatUserToken(newUser, req, res)
      }
      catch (error) {
         res.status(500).json({ message: error })

      }
   }
   static async login(req, res) {

      const { email, password } = req.body

      if (!email) {
         res.status(422).json({ message: 'O Email é obrigatório!' })
         return
      }

      if (!password) {
         res.status(422).json({ message: 'A senha é obrigatória!' })
         return
      }

      //check if user exists

      const user = await User.findOne({ email: email })

      if (!user) {
         res.status(422).json({ message: 'Não há usuario cadastrado com esse email' })
         return

      }
      //check if password match width db password

      const checkPassword = await bcrypt.compare(password, user.password)

      if (!checkPassword) {
         res.status(422).json({ message: 'senha inválida!', })
         return

      }

      await creatUserToken(user, req, res)

   }

   static async checkUser(req, res) {
      let currentUser

      if (req.headers.authorization) {
         const token = getToken(req)
         const decoded = jwt.verify(token, 'nossosecret')

         currentUser = await User.findById(decoded.id)
         currentUser.password = undefined

      } else {

         currentUser = null
      }
      res.status(200).send(currentUser)
   }
   static async getUserById(req, res) {
      const id = req.params.id
      const user = await User.findById(id).select('-password')

      if (!user) {
         res.status(422).json({ message: 'Usuário Não encontrado!', })
         return
      }

      res.status(200).json({ user })

   }

   static async editUser(req, res) {

      const id = req.params.id

      //check if user exist
      const token = getToken(req)
      const user = await getUserByToken(token)

      const { name, email, phone, password, confirmpassword } = req.body

      if (req.file) {
         user.image = req.file.filename
         
      }



      //validations

      if (!user) {
         res.status(422).json({ message: 'Usuário não encontrado!', })
         return
      }

      if (!name) {
         res.status(422).json({ message: 'O nome é obrigatório!' })
         return
      }

      if (!email) {
         res.status(422).json({ message: 'O Email é obrigatório!' })
         return
      }

      //check if email has already taken

      const userExists = await User.findOne({ email: email })
      if (user.email !== email && userExists) {
         res.status(422).json({ message: 'Email já cadastrado, use por favor Outro!', })
         return
      }

      user.email = email

      if (!phone) {
         res.status(422).json({ message: 'O Telefone é obrigatório!' })
         return
      }

      user.phone = phone

      if (password != confirmpassword) {
         res.status(422).json({ message: 'Senhas não Conferem!' })
         return
      } else if (password === confirmpassword && password != null) {

         //Creat password

         const salt = await bcrypt.genSalt(12)
         const passwordHash = await bcrypt.hash(password, salt)

         user.password = passwordHash

      }
      try {

         //returns user updated data
         const updatedUser = await User.findOneAndUpdate(

            { id: user._id }, { $set: user }, { new: true }
         )
         res.status(200).json({ message: 'Usuário atualizado com sucesso!', })

      } catch (err) {
         res.status(500).json({ message: err })
      }

   }

}