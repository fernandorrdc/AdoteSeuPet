const express = require('express')
const cors =require('cors')

const app = express()



 //config JSON  response
 app.use(express.json())

 //solve CORS
 app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

 //Public folder for Images
 app.use(express.static('public'))

//Routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)


app.listen(5000)