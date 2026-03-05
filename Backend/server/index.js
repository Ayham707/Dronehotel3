import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3006;

app.get('/', (req, res) => {
  res.send('Dronehotel backend iiiiiiis running');
});

// add more routes here

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
