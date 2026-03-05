import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3006;

app.get('/', (req, res) => {
  res.send('Dronehotel backend iiiiiiis running');
});

app.get("/dronehotel", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM DH_DroneHotel");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});