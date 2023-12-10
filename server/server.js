import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3001;

const mongoUrl = 'mongodb+srv://2021ucs0106:9x6hM0egCSi4t5Qf@cluster0.hm3fpk3.mongodb.net/your-database-name?retryWrites=true&w=majority';


MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

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
});