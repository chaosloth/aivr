import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, query } = req;
  const { prompt } = body;

  if (!query.api_key || query.api_key != process.env.API_KEY) {
    return res.status(401).json({ message: "API Key incorrect" });
  }

  try {
    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(config);
    const image_response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
    });

    console.log("Image generation response", image_response);

    return res.status(200).json(image_response);
  } catch (error) {
    console.log("Error generating image", error);
    return res.status(500).json({ error });
  }
}
