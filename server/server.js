import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

import connectDB from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './utils/auth.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const mongoUrl = 'mongodb+srv://2021ucs0106:9x6hM0egCSi4t5Qf@cluster0.hm3fpk3.mongodb.net/Roadmaps?retryWrites=true&w=majority';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(new URL('../client/dist', import.meta.url).pathname)));
}

const startServer = async () => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = client.db('Roadmaps');
    const collection = db.collection('Javascript');

    // REST API
    app.get('/get-data', async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware,
    });

    await server.start();
    server.applyMiddleware({ app });

    process.on('SIGINT', () => {
      client.close();
      process.exit();
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

startServer();
