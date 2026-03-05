import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST_IP,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

db.getConnection()
  .then(conn => {
    console.log("✅ Connected to MySQL (remote)");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err);
  });

export default db;