const express = require('express')
const server = express()
const path = require('path')
const auth = require('./auth')
const cookieParser = require('cookie-parser')

server.use(express.json())
server.use(cookieParser())
server.use(auth)
server.use(express.static(path.join(__dirname, 'test-admin-app/build')))


server.get('/api', (req,res) =>{
    res.send('<h3>Server Running</h>')
})

server.get('/', (req,res)=>{
    res.status(200)
})


module.exports = server