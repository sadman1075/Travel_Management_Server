import express from "express"


const app=express()

app.get("/",async(req,res)=>{
    res.send("server is running man")
})



export default app;
