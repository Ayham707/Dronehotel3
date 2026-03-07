import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import db from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3006;


/* ------------------------- */
/* ROOT */
/* ------------------------- */

app.get("/", (req, res) => {
  res.send("Dronehotel backend is running");
});


/* ------------------------- */
/* GET ALL DRONEHOTELS */
/* ------------------------- */

app.get("/dronehotel", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM DH_DroneHotel");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ------------------------- */
/* GET ONE DRONEHOTEL */
/* ------------------------- */

app.get("/dronehotel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM DH_DroneHotel WHERE DHDHOTELId = ?",
      [id]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* ------------------------- */
/* FETCH WEATHER FROM API */
/* ------------------------- */

async function getWeatherData(lat, lon) {

  try {

    const url = `http://weerlive.nl/api/json-data-10min.php?key=a94ec284ab&locatie=${lat},${lon}`;

    const response = await fetch(url);

    const data = await response.json();

    return data.liveweer[0];

  } catch (error) {

    console.error("Weather API error:", error);

    return null;

  }

}


/* ------------------------- */
/* GET WEATHER FOR HOTEL */
/* ------------------------- */

app.get("/weather/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const [hotel] = await db.query(
      "SELECT DHDHOTEL_Latitude, DHDHOTEL_Longitude FROM DH_DroneHotel WHERE DHDHOTELId = ?",
      [id]
    );

    if (hotel.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const lat = hotel[0].DHDHOTEL_Latitude;
    const lon = hotel[0].DHDHOTEL_Longitude;

    const weather = await getWeatherData(lat, lon);

    if (!weather) {
      return res.status(500).json({ error: "Weather API failed" });
    }

    res.json(weather);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* ------------------------- */
/* SAVE WEATHER IN DATABASE */
/* ------------------------- */

app.get("/weather/save/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const [hotel] = await db.query(
      "SELECT DHDHOTEL_Latitude, DHDHOTEL_Longitude FROM DH_DroneHotel WHERE DHDHOTELId =  ?",
      [id]
    );

    if (hotel.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const lat = hotel[0].DHDHOTEL_Latitude;
    const lon = hotel[0].DHDHOTEL_Longitude;

    const weather = await getWeatherData(lat, lon);

    await db.query(
      `INSERT INTO weather_data
      (temp, luchtv, windri, windms, plaats)
      VALUES (?, ?, ?, ?, ?)`,
      [
        weather.temp,
        weather.lv,
        weather.windr,
        weather.windms,
        weather.plaats
      ]
    );

    res.json({
      message: "Weather saved",
      weather
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }

});


/* ------------------------- */
/* SERVER START */
/* ------------------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});