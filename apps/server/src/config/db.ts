import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    // Automatically use memory server if local MongoDB is not running or no URI is provided
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      const { MongoMemoryReplSet } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
      uri = mongoServer.getUri();
      console.log('Using MongoDB Memory ReplSet for local development (supports transactions)');
    }

    const conn = await mongoose.connect(uri as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
