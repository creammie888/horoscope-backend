const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "https://horoscope-frontend-g223.onrender.com"],
  methods: ["GET", "POST"]
}));

app.use(express.json());

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  queueLimit: 0,
  // ssl: { rejectUnauthorized: false }

  // authPlugins: {
  //   mysql_native_password: true,
  // },
});

// เชื่อมต่อ MySQL
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL on Railway!");
  connection.release();
});


// สร้าง API Endpoint
app.get("/tarot_cards", (req, res) => {
  db.query("SELECT * FROM tarot_cards", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    console.log(results);
    res.json(results);
  });
});

app.get("/api/tarot", (req, res) => {
  db.query("SELECT * FROM tarot_cards ORDER BY RAND() LIMIT 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0]);
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});




const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD );
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("SERVER_PORT:", process.env.SERVER_PORT);
