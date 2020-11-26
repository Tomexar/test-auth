var express = require('express')
var app = express()
const path = require('path')

const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const jwksClient = require('jwks-rsa')

app.use(cookieParser)
app.use(express.json())

require("dotenv").config


const certs = process.env.certs
const cookieName1 = process.env.cookieName1
const cookieName2 = process.env.cookieName2
const AUD = process.env.AUD
const pubKey = process.env.pubKey

//CF_Authorization
//eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4ZmExOTMyNzQ4NjBiZjE3YWI0YjMyZTQzMWY2NTM0OGQyMGJmYTZlN2IyNWI0MmNjZmU3ZmM4ZDJlNzA1MzcifQ.eyJhdWQiOiJjODkxOTEwMDc2ZjkxZDU5ZTRkZDI3MTg1NjU2ZGNlYjEzYWUyNDllOTM1ZTQ2NWVlNTgyZjc2Y2Q3ZTBjMjRhIiwiZW1haWwiOiJ0b21teWV4YXJAZ21haWwuY29tIiwiYWNjb3VudF9pZCI6ImMwYzI1ZmIzZDYxZDI2N2I2YzE4MDQzMTVjOGY2MGY2IiwiZXhwIjoxNjA2NTAyMzc1LCJpYXQiOjE2MDY0MTU5NzUsIm5iZiI6MTYwNjQxNTk3NSwiaXNzIjoiaHR0cHM6Ly9zdGFuZGFyZGJvdHMuY2xvdWRmbGFyZWFjY2Vzcy5jb20iLCJzdWIiOiJmOGI4MWUzNS0yNjQxLTQ1OGQtODlkZi01ZTQ5ZjBkOGJmMzMiLCJpZGVudGl0eSI6eyJlbWFpbCI6InRvbW15ZXhhckBnbWFpbC5jb20iLCJpZHAiOnsidHlwZSI6Im9uZXRpbWVwaW4ifSwiZ2VvIjp7ImNvdW50cnkiOiJVUyJ9LCJ1c2VyX3V1aWQiOiJmOGI4MWUzNS0yNjQxLTQ1OGQtODlkZi01ZTQ5ZjBkOGJmMzMifSwidHlwZSI6Im9yZyIsImlkZW50aXR5X25vbmNlIjoiMXpWdnNuVUNvaGlWQzhreSJ9.vNJsdCsmZzYk6BlJk_ffyGJnR6IEtok2JvObBAiqfePLwDKiWSl4ERl7C8Ke1_kkj42jIG5q7-AIpVieCR7nDNoxHAZmuaEwBIlgAChmAD0YOg1Wi7TT23ISoDA7OLDR4ze1TMoDRi7-AtfnUmGWOqVsjI24aE67YK-0eBXgqoRYFSBi8v1-PAl_hNft5SwmUkvhuGZKR03EhSp9m8qvflskT8wnYU9rhgilGG7q8c_YjS4jdL-XKHw-l_-UhQPhTfKZxwlNRo47K5uJPQ-EksnbzMMWSSNcxVZK9znVL2zUXjuQI-8mUzrKQaIIawX9AZEsC93uxZVHRx7HOHtgkw


const client = jwksClient({
    jwksUri: certs
})


const auth = async (req, res, next) =>{
    //console.log(req.cookies)
    const token = req.cookies[cookieName2]
    //console.log(token)
    if (!token){
        //no token 
        console.log('No Token')
        res.status(403).json({message: 'could not find token'})
        
        //res.sendFile(path.join(__dirname + '/pages/404.html'))  
        
        //ERRORS ON THE ABOVE SENDFILE
        //RangeNotSatisfiableError: Range Not Satisfiable
        //:4000/:1 GET http://localhost:4000/ net::ERR_CONTENT_LENGTH_MISMATCH 200 (OK)  
    } else {
        console.log('Token Found')
        client.getSigningKey(pubKey, (err, key)=>{
            if (err){
                console.log('error getting key')
                console.log(err)
                res.status(403).json({message: 'error getting key'})
            } else {
                const signingKey = key.getPublicKey()
                //console.log(signingKey)

                try {
                    jwt.verify(token, signingKey, {
                        audience: AUD,  
                    })
                    console.log('success')
                } catch(err){
                    console.log('token err')
                    console.log(err)
                    res.status(403).json({ message: 'token error '})
                }          
                console.log('NEXT')
            }
        })
    }
    next()
}

module.exports = auth



