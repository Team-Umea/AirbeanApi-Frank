import express from "express";


const app = express();
app.use(express.json());

app.get("/", (req,res) =>{
    res.status(200).send("Hej världern");
})

export default app;