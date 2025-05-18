import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/niche_platform';
let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (!client || !db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
  }
  return db;
}
