import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './utils/auth.js';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3001;
const mongoUrl = 'mongodb+srv://2021ucs0106:9x6hM0egCSi4t5Qf@cluster0.hm3fpk3.mongodb.net/Roadmaps?retryWrites=true&w=majority';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();
app.use(cors()); // Enable CORS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(new URL('../client/dist', import.meta.url).pathname)));
}

// Define your /get-data route before the wildcard route
// ...

let allData = []; // Global variable to store data

app.get('/get-data', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = client.db('Roadmaps');
    const collection = db.collection('Javascript');

    allData = await collection.find({}).toArray();
    res.json(allData);

    client.close();
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../client/index.html');
  res.sendFile(indexPath);
});

// ...


// Wildcard route for serving HTML
// app.get('*', (req, res) => {
//   const indexPath = path.join(__dirname, '../client/index.html');
//   res.sendFile(indexPath);
// });

const startServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });
    connectDB(process.env.MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
