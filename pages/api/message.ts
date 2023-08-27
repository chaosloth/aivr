import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;

  if (!query.api_key || query.api_key != process.env.API_KEY) {
    return res.status(401).json({ message: "API Key incorrect" });
  }

  if (!query.to) {
    return res.status(400).json({ message: "Missing 'to'" });
  }

  if (!query.url) {
    return res.status(400).json({ message: "Missing 'url'" });
  }

  const to = query.to as string;
  const url = query.url as string;

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    client.messages.create({
      body: "Yo!",
      from: process.env.TWILIO_FROM_NUMBER,
      to: to,
      mediaUrl: [url],
    });

    return res.status(200).send({ status: "complete" });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
