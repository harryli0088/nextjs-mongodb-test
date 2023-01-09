import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import getDb from "../../../lib/getDb";
import getEmailFromSession from "../../../lib/getEmailFromSession";
import { ListingHistoryType, ListingStatusType } from "../../../types/listing";
import ResponseFuncs from "../../../types/responseFuncs";


export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession(req, res)
    if(!session) { return res.status(401).json({}) }
    console.log("session",session)
  
    //capture request method, we type it as a key of ResponseFunc to reduce typing later
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

    // Potential Responses
    const handleCase: ResponseFuncs = {
      POST: async (req: NextApiRequest, res: NextApiResponse) => {
        const email = getEmailFromSession(session)
        if (email) {
          const { _id } = req.body;

          //TODO input validation

          const $push:{history: ListingHistoryType} = {
            history: {
              date: new Date().getTime(),
              description: "shipped"
            }
          }

          const $set:{status: ListingStatusType} = {
            status: "shipped", //TODO use variable field
          }
  
          const db = await getDb()
          const result = await db.collection("listings").updateOne(
            {
              _id: new ObjectId(_id),
              sellerId: email, //the user owns this listing
              status: "bought", //TODO make a config variable or something
            },
            {$push, $set},
            {upsert: false} //don't create a new listing if it doesn't exist
          )
  
          if(result.modifiedCount === 1) { //if a document was updated
            //TODO email notifications
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
});