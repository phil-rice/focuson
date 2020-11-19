const express= require('express')

var app =express()

app.get("/", function(req, res){
    res.send("hello world")
})

let port = 3005
app.listen(port)
console.log("Started on ", 3005)