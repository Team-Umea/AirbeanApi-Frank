import { Pool } from "pg";
//För att connecta till databasen

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "PractiseServer",
  password: "123",
  port: 5432,
});
export default pool;
