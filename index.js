import app from "./app.js";
import http from "http";
import createTables from "./models/setupDB.js";

const port = process.env.PORT || 8000;

const server = http.createServer(app);
createTables().then(() => {
  server.listen(port, () => {
    console.log(`servern körs på http://localhost:${port}`);
  });
});
