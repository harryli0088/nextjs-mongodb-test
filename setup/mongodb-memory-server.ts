import { afterAll, beforeAll } from "vitest";
import { MongoMemoryServer } from 'mongodb-memory-server';

//inspired by https://github.com/ec965/vitest-mongodb/blob/main/vitest-mongodb/src/index.ts

export async function setup() {
  global.__MONGO_DB__ = await MongoMemoryServer.create();
  process.env.MONGODB_URI= global.__MONGO_DB__.getUri();
  console.log("Mongodb memory server URI:", process.env.MONGODB_URI);
}

export async function teardown() {
  if (globalThis.__MONGO_DB__) {
    console.log("Stopping mongodb memory server");
    await global.__MONGO_DB__.stop();
  }
}