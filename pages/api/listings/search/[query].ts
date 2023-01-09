import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from '@auth0/nextjs-auth0';
import getDb from "../../../../lib/getDb";
import getEmailFromSession from "../../../../lib/getEmailFromSession";
import publicizeListing from "../../../../lib/listing/publicizeListing";
import { ListingInterface } from "../../../../types/listing";
import ResponseFuncs from "../../../../types/responseFuncs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession(req, res)
    console.log("session",session)
    const email = getEmailFromSession(session)
  
    //capture request method, we type it as a key of ResponseFunc to reduce typing later
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

    // Potential Responses
    const handleCase: ResponseFuncs = {
      GET: async (req: NextApiRequest, res: NextApiResponse) => {
        const db = await getDb()

        const { query } = req.query

        //https://www.mongodb.com/developer/products/atlas/building-autocomplete-form-element-atlas-search-javascript/
        //https://www.mongodb.com/docs/atlas/atlas-search/tutorial/autocomplete-tutorial/
        const listings = (
          await db.collection("listings").aggregate<ListingInterface>([
            {
              $search: {
                index: "default", // optional, defaults to "default"
                autocomplete: {
                  query,
                  path: "title",
                  fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3
                  }
                }
              }
            },
            { $match: {'status': {$eq: "available"}}},
            {
              $limit: 5
            },
          ]).sort(
            { score: { $meta: "textScore" } }
          ).toArray()
        ).map((l) => publicizeListing(l,email)) as ListingInterface[]

        res.json(JSON.parse(JSON.stringify(listings)))
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
