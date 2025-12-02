const http = require("node:http")

const server = http.createServer(function(req,res){
    res.end("Hello world!")
})

server.listen(1111)