import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb"

export default async (req:NextApiRequest, res:NextApiResponse) => {
   try {
      const { id } = req.query
      const client = await clientPromise;
      const db = client.db("sample_mflix");

      console.log("id",id)

      const movie = await db
          .collection("movies")
          .findOne({movie_id:new ObjectId(String(id))})

      res.json(movie);
   } catch (e) {
      console.error(e);
   }
};