// Cached MongoDB client singleton. Survives hot reload in dev (uses globalThis).
import { MongoClient, type Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = (() => {
  if (!uri) return 'dailytracker';
  // Extract path segment after the host as the default db name (if URI includes one)
  const match = uri.match(/\.mongodb\.net\/([^?]+)/);
  return match?.[1] || 'dailytracker';
})();

declare global {

  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Add it to .env.local — see .env.example for the format.',
    );
  }
  if (process.env.NODE_ENV === 'development') {
    if (!globalThis.__mongoClientPromise) {
      globalThis.__mongoClientPromise = new MongoClient(uri, {
        serverSelectionTimeoutMS: 8000,
      }).connect();
    }
    return globalThis.__mongoClientPromise;
  }
  return new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect();
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

export type UserDoc = {
  _id?: import('mongodb').ObjectId;
  email: string;
  displayName: string;
  passwordHash: string;
  data: {
    todos: unknown[];
    habits: unknown[];
    goals: unknown[];
    trackers: unknown[];
  };
  createdAt: Date;
  updatedAt: Date;
};

export async function getUsersCollection() {
  const db = await getDb();
  const col = db.collection<UserDoc>('users');
  // Idempotent index creation (cheap if it already exists)
  await col.createIndex({ email: 1 }, { unique: true }).catch(() => {});
  return col;
}
