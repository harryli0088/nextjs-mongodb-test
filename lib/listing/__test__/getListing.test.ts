import { ObjectId } from 'mongodb'
import { afterAll, assert, beforeAll, describe, expect, it } from 'vitest'
import getDb from '../../getDb'
import getListing from '../getListing'

describe('getListing', () => {
  let insertedIds:{[idx:number]: ObjectId} = {}
  beforeAll(async () => {
    const db = await getDb()
    const result = await db.collection("listings").insertMany(TEST_DATA);
    insertedIds = result.insertedIds
  })

  afterAll(async () => {
    const db = await getDb()
    await db.collection('listings').deleteMany({});
  })


  it('returns the appropriate listings for the seller', async () => {
    expect(await getListing(insertedIds[0].toString(), "mySellerId")).toMatchObject({
      ...TEST_DATA[0],
    })
    expect(await getListing(insertedIds[1].toString(), "mySellerId")).toMatchObject({
      ...TEST_DATA[1],
      buyerId: null,
    })
    expect(await getListing(insertedIds[2].toString(), "mySellerId")).toMatchObject({
      ...TEST_DATA[2],
      buyerId: null,
    })
    expect(await getListing(insertedIds[3].toString(), "mySellerId")).toMatchObject({
      ...TEST_DATA[3],
      buyerId: null,
    })
    expect(await getListing(insertedIds[4].toString(), "mySellerId")).toEqual(null)
    expect(await getListing(insertedIds[5].toString(), "mySellerId")).toEqual(null)
  })

  it('returns the appropriate listings for the buyer', async () => {
    expect(await getListing(insertedIds[0].toString(), "myBuyerId")).toMatchObject({
      ...TEST_DATA[0],
      sellerId: null,
    })
    expect(await getListing(insertedIds[1].toString(), "myBuyerId")).toMatchObject({
      ...TEST_DATA[1],
      sellerId: null,
    })
    expect(await getListing(insertedIds[2].toString(), "myBuyerId")).toMatchObject({
      ...TEST_DATA[2],
      sellerId: null,
    })
    expect(await getListing(insertedIds[3].toString(), "myBuyerId")).toEqual(null)
    expect(await getListing(insertedIds[4].toString(), "myBuyerId")).toMatchObject({
      ...TEST_DATA[4],
      sellerId: null,
    })
    expect(await getListing(insertedIds[5].toString(), "myBuyerId")).toEqual(null)
  })

  it('returns the appropriate listings for the a non logged in user', async () => {
    expect(await getListing(insertedIds[0].toString(), null)).toMatchObject({
      ...TEST_DATA[0],
      sellerId: null,
    })
    expect(await getListing(insertedIds[1].toString(), null)).toEqual(null)
    expect(await getListing(insertedIds[2].toString(), null)).toEqual(null)
    expect(await getListing(insertedIds[3].toString(), null)).toEqual(null)
    expect(await getListing(insertedIds[4].toString(), null)).toEqual(null)
    expect(await getListing(insertedIds[5].toString(), null)).toEqual(null)
  })

  it('filters listings for the seller by status', async () => {
    expect(await getListing(insertedIds[0].toString(), "mySellerId", "available")).toMatchObject({
      ...TEST_DATA[0],
    })
    expect(await getListing(insertedIds[1].toString(), "mySellerId", "available")).toEqual(null)
    expect(await getListing(insertedIds[2].toString(), "mySellerId", "available")).toEqual(null)
    expect(await getListing(insertedIds[3].toString(), "mySellerId", "available")).toEqual(null)
    expect(await getListing(insertedIds[4].toString(), "mySellerId", "available")).toEqual(null)
    expect(await getListing(insertedIds[5].toString(), "mySellerId", "available")).toEqual(null)
  })
})

const TEST_DATA = [
  { //available listing, mySellerId, no buyer
    buyerId: null,
    description: "my description",
    history: [{
      date: new Date().getTime(),
      description: "created",
    }],
    price: 123,
    sellerId: "mySellerId",
    status: "available",
    title: "my title",
  },
  { //in process listing, mySellerId, myBuyerId
    buyerId: "myBuyerId",
    description: "my description",
    history: [{
      date: new Date().getTime(),
      description: "created",
    }], //TODO history
    price: 123,
    sellerId: "mySellerId",
    status: "shipped",
    title: "my title",
  },
  { //completed listing, mySellerId, myBuyerId
    buyerId: "myBuyerId",
    description: "my description",
    history: [{
      date: new Date().getTime(),
      description: "created",
    }], //TODO history
    price: 123,
    sellerId: "mySellerId",
    status: "completed",
    title: "my title",
  },
  { //completed listing, mySellerId, myBuyerId2
    buyerId: "myBuyerId2",
    description: "my description",
    history: [{
      date: new Date().getTime(),
      description: "created",
    }], //TODO history
    price: 123,
    sellerId: "mySellerId",
    status: "completed",
    title: "my title",
  },
  { //completed listing, mySellerId2, myBuyerId
    buyerId: "myBuyerId",
    description: "my description",
    history: [{
      date: new Date().getTime(),
      description: "created",
    }], //TODO history
    price: 123,
    sellerId: "mySellerId2",
    status: "completed",
    title: "my title",
  },
  { //completed listing, mySellerId2, myBuyerId2
    buyerId: "myBuyerId2",
    description: "my description",
    history: [{
      date: new Date().getTime(),
      description: "created",
    }], //TODO history
    price: 123,
    sellerId: "mySellerId2",
    status: "completed",
    title: "my title",
  },
]