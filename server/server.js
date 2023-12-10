import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3001;

const mongoUrl = 'mongodb+srv://2021ucs0106:9x6hM0egCSi4t5Qf@cluster0.hm3fpk3.mongodb.net/Roadmaps?retryWrites=true&w=majority';

async function startServer() {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = client.db('Roadmaps');
    const collection = db.collection('Javascript');
    
    app.get('/get-data', async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    process.on('SIGINT', () => {
      client.close();
      process.exit();
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

startServer();
