import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import clientPromise from "../../../lib/mongodb";
import { Listing } from "../../../types/listing";
import { ResponseFuncs } from "../../../utils/types"
import { authOptions } from "../auth/[...nextauth]"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)
    console.log("session",session)
  
    //capture request method, we type it as a key of ResponseFunc to reduce typing later
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

    // Potential Responses
    const handleCase: ResponseFuncs = {
      GET: async (req: NextApiRequest, res: NextApiResponse) => {
        const client = await clientPromise;
        const db = client.db("test");
  
        const listings = (await (await db.collection("listings").find<Listing>({}).toArray()).map((listing) => {
          delete listing.buyerId
          delete listing.sellerId
          return listing
        })) as Listing[];
  
        res.json(listings)
      },
      POST: async (req: NextApiRequest, res: NextApiResponse) => {
        res.json(200)
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