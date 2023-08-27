import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  const id = uuidv4();
  console.log(`Running example delay, req id: ${id}`);

  try {
    setTimeout(() => {
      console.log(`This happened after we returned the response, id: ${id}`);
    }, 3000);

    return res.status(200).send({ status: `processing - id: ${id}` });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
