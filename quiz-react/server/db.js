const { Pool }= require("pg");

const pool = new Pool({
    user: "postgres" ,
    host: "localhost",
    port: 5432,
    database: "postgres",
    password: "Uzmapostgres@23"
});

pool
.connect()
.then(()=> console.log("connection"))
.catch((err)=> console.log(err));

module.exports=pool;