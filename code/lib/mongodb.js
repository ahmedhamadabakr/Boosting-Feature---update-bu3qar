import { MongoClient } from "mongodb";

let indexesCreated = false;
async function createIndexes(client) {
  if (indexesCreated) return client;
  const db = client.db();
  await Promise.all([
    db
      .collection("tokens")
      .createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }),

    db
      .collection("users")
      .createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }),

    db.collection("users").createIndexes([
      { key: { email: 1 }, unique: true },
      // { key: { username: 1 }, unique: true },
    ]),

    db.collection("boost_items").createIndexes([
      { key: { advertiserId: 1 } },
      { key: { listingId: 1 } },
      { key: { status: 1 } },
      { key: { priority: -1 } },
      { key: { purchaseDate: -1 } },
    ]),

    // queue_slots: unique per date+time, fast lookup for available slots
    db.collection("queue_slots").createIndexes([
      { key: { date: 1, time: 1 }, unique: true },
      { key: { bookedCount: 1 } },
      { key: { items: 1 } },
    ]),
  ]);
  indexesCreated = true;
  return client;
}

export async function getMongoClient() {
  if (!global.mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    // client.connect() returns an instance of MongoClient when resolved
    global.mongoClientPromise = client
      .connect()
      .then((client) => createIndexes(client));
  }
  return global.mongoClientPromise;
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db();
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 * https://github.com/vercel/next.js/pull/17666
 */
