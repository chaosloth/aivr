import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  try {
    const openai = new OpenAI();
    const image_response = await openai.images.generate({
      prompt: body.prompt,
      size: "512x512",
    });

    console.log("Image generation response", image_response);

    return res.status(200).json(image_response);
  } catch (error) {
    console.log("Error generating image", error);
    return res.status(500).json({ error });
  }
}
