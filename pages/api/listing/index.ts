import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next"
import { Session, unstable_getServerSession } from "next-auth"
import getDb from "../../../lib/getDb";
import getEmailFromSession from "../../../lib/getEmailFromSession";
import { ListingHistoryType, ListingInterface } from "../../../types/listing";
import ResponseFuncs from "../../../types/responseFuncs";
import { authOptions } from "../auth/[...nextauth]"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions) as Session
    console.log("session",session)
  
    //capture request method, we type it as a key of ResponseFunc to reduce typing later
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

    // Potential Responses
    const handleCase: ResponseFuncs = {
      POST: async (req: NextApiRequest, res: NextApiResponse) => {
        const email = getEmailFromSession(session)
        if (email) {
          const { description, price, title } = req.body;

          //TODO input validation
  
          //@ts-ignore
          const newListing:ListingInterface = { //TODO how to Typescript-ify this?
            buyerId: null,
            description,
            history: [{
              date: new Date().getTime(),
              description: "created",
            }],
            price,
            sellerId: email,
            status: "available",
            title,
          }
  
          const db = await getDb()
          const result = await db.collection("listings").insertOne(newListing);
  
          res.status(200).json({_id: result.insertedId.toString()});
        }
        else {
          res.json(401) //unauthorized
        }
      },
      PUT: async (req: NextApiRequest, res: NextApiResponse) => {
        const email = getEmailFromSession(session)
        if (email) {
          const { _id, description, price, title } = req.body;

          //TODO input validation, ex _id is required

          const $push:{history: ListingHistoryType} = {
            history: {
              date: new Date().getTime(),
              description: "seller edit"
            }
          }
  
          const $set:{[key:string]: any} = {
            description, 
            price,
            title,
          }
          Object.keys($set).forEach(key => { //remove any empty keys
            if($set[key] === undefined || $set[key] === null) {
              delete $set[key]
            }
          })
  
          const db = await getDb()
          const result = await db.collection("listings").updateOne(
            { _id: new ObjectId(_id), status: "available", sellerId: email }, //TODO make "available" a config variable or something
            {$push, $set},
            {upsert: false} //don't create a new listing if it doesn't exist
          )
          
          if(result.modifiedCount === 1) { //if a document was updated
            res.status(200).json({})
          }
          else {
            res.status(400).json({ error: "No matching document" })
          }
        }
        else {
          res.json(401) //unauthorized
        }
      },
    }
  
    // Check if there is a response for the particular method, if so invoke it, if not response with an error
    const response = handleCase[method]
    if (response) response(req, res)
    else res.status(400).json({ error: "No Response for This Request" })
  }
  catch(error) {
    console.log(error)
    res.status(400).json({ error })
  }
}

export default handler