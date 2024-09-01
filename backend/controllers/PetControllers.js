const Pet = require('../models/Pet')

const { default: mongoose } = require('mongoose')
//helpers

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const { json } = require('express')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {
    //Create a Pet

    static async create(req, res) {
        const { name, age, weight, color } = req.body
        const available = true
        const images = req.files

        //


        //validations
        if (!name) {
            res.status(422).json({ message: 'Nome é Obrigatório!' })
            return
        }

        if (!age) {
            res.status(422).json({ message: 'A idade é Obrigatória!' })
            return
        }

        if (!weight) {
            res.status(422).json({ message: 'O peso é Obrigatório!' })
            return
        }

        if (!color) {
            res.status(422).json({ message: 'A cor é Obrigatória!' })
            return
        }

        if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é Obrigatória!' })
            return
        }


        //get pet owner

        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a Pet

        const pet = new Pet(
            {

                name,
                age,
                weight,
                color,
                available,
                images: [],
                user: {
                    _id: user._id,
                    name: user.name,
                    image: user.image,
                    phone: user.phone,
                },

            })

        images.map((image) => {
            pet.images.push(image.filename)
        })
        try {
            const newPet = await pet.save()
            res.status(201).json({ message: 'Pet cadastrado com sucesso!', newPet, })

        } catch (error) {
            res.status(500).json({ message: error })

        }

    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')
        res.status(200).json({ pets: pets, })
    }

    static async getAllUserPets(req, res) {

        //get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort(' -createdArt')
        res.status(200).json({ pets, })


    }

    static async getAllUserAdoptions(req, res) {
        //get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort(' -createdArt')
        res.status(200).json({ pets, })


    }

    static async getPetById(req, res) {

        //check if ID is valid
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Inválido!' })
            return
        }

        //check if Pet exist

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet Não encontrado!' })

        }

        res.status(200).json({ pet: pet, })

    }

    static async removePetById(req, res) {
        const id = req.params.id

        //check if ID is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Inválido!' })
            return
        }

        //check if Pet exist

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet Não encontrado!' })
            return
        }

        //check if logged is User registered the Pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        //console.log(pet.user._id)
        //console.log(user._id)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'problema em processar sua solicitação , tente mais tarde!' })
            return

        }

        await Pet.findByIdAndDelete(id)
        res.status(200).json({ message: 'Pet removido com sucesso!' })
    }

    static async updatePat(req, res) {

        const id = req.params.id

        const { name, age, weight, color, available } = req.body

        const images = req.files
        const updatedData = {}

        //check if Pets Exists

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet Não encontrado!' })
            return
        }
        //check if logged is User registered the Pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'problema em processar sua solicitação , tente mais tarde!' })
            return

        }

        //validations
        if (!name) {
            res.status(422).json({ message: 'Nome é Obrigatório!' })
            return
        } else {
            updatedData.name = name
        }

        if (!age) {
            res.status(422).json({ message: 'A idade é Obrigatória!' })
            return
        } else {
            updatedData.age = age
        }

        if (!weight) {
            res.status(422).json({ message: 'O peso é Obrigatório!' })
            return
        } else {
            updatedData.weight = weight
        }

        if (!color) {
            res.status(422).json({ message: 'A cor é Obrigatória!' })
            return
        } else {
            updatedData.color = color
        }

        if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é Obrigatória!' })
            return
        } else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)
        res.status(200).json({ message: 'Pet atualizado com Exito!' })

    }

    static async schedule(req, res) {
        const id =  req.params.id

        //check if Pet Exist 

        if (!pet) {
            res.status(404).json({ message: 'Pet Não encontrado!' })
            return
        }

        //check if User registered the Pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Não dá para agendar uma visita para seu próprio PET!!!!' })
            return

        }
        
        //checked if user has  already scheduler a visit

        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({ message: 'você já agendou uma visita para esse PET!' })
            return

            }
        }

        //add User to Pat

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image:user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: `Visita agendada com EXITO, entre em contato com: ${pet.user.name}, pelo Fone: ${pet.user.phone}`
        })


    }

    static async concludAdoption (req, res) {

        const id =  req.params.id

        //check if Pet Exist 

        if (!pet) {
            res.status(404).json({ message: 'Pet Não encontrado!' })
            return
        }

        //check if logged is User registered the Pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'problema em processar sua solicitação , tente mais tarde!' })
            return

        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: 'Parabéns ciclo de adoção finalizado com sucesso!'
        })
    }
}