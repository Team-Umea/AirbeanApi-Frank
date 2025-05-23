import app from "./app.js";
import http from "http";
import createTables from "./config/setupDB.js";
import setupSwagger from "./docs/swagger.js";

const port = process.env.PORT || 8000;

const server = http.createServer(app);
setupSwagger(app);
createTables().then(() => {
  server.listen(port, () => {
    console.log(`servern körs på http://localhost:${port}`);
  });
});
