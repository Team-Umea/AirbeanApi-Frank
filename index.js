import app from "./app.js";
import http from "http";

const port = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port, ()=>{
    console.log(`servern körs på http://localhost:${port}`);
})

