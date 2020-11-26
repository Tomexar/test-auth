require("dotenv").config()
const server = require('./api/server')

PORT = process.env.PORT || 4000

server.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
    //console.log(process.env)
})