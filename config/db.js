import {Pool} from "pg";

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"postgres",
    password:"1234",
    port:"8000"
});

export default pool;