import { NextApiRequest, NextApiResponse } from "next";

import Jimp from "jimp";
import OpenAI from "openai";
import { supabase } from "./_supabase";
import { v4 as uuidv4 } from "uuid";
import twilio from "twilio";

const generateImage = async (prompt: string, to: string) => {
  try {
    console.log(`Generating image for prompt: ${prompt}`);

    //
    // GENERATE IMAGE
    //
    const openai = new OpenAI();
    const image_response = await openai.images.generate({
      prompt: prompt,
      size: "512x512",
    });

    //
    // COMPOSITE IMAGE
    //
    const image_target = await Jimp.read(image_response.data[0].url);
    const image_mask = await Jimp.read("https://images-5674.twil.io/mask.png");
    image_target.blit(image_mask, 0, 0);

    image_target.getBuffer(Jimp.MIME_PNG, async (err, masked_image_buffer) => {
      console.log("Got AI image");
      if (err) {
        console.log("Error getting image", err);
        return;
      }

      console.log("Returning masked image");
      //
      // UPLOAD IMAGE
      //
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET)
        .upload(`public/${uuidv4()}.png`, masked_image_buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: Jimp.MIME_PNG,
        });

      if (error) {
        console.log("Error uploading file", error);
        return;
      }

      //
      // CREATE URL
      //
      console.log("Upload result", data);
      const end_image_url = `${
        process.env.SUPABASE_PROJECT_URL
      }/storage/v1/object/public/${process.env.SUPABASE_STORAGE_BUCKET}/${
        data.path
      }?rand=${uuidv4()}`;
      console.log(`Uploaded URL is ${end_image_url}`);

      //
      // SEND MESSAGE
      //
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      client.messages.create({
        body: "Yo!",
        from: process.env.TWILIO_FROM_NUMBER,
        to: to,
        mediaUrl: [end_image_url],
      });
    });
  } catch (error) {
    console.log("Error processing image mask", error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log("Request", req);

  const { query } = req;

  if (!query.api_key || query.api_key != process.env.API_KEY) {
    return res.status(401).json({ message: "API Key incorrect" });
  }

  if (!query.prompt) {
    return res.status(400).json({ message: "Missing prompt" });
  }

  if (!query.to) {
    return res.status(400).json({ message: "Missing 'to'" });
  }

  generateImage(query.prompt as string, query.to as string).then(() => {
    console.log("Image generation complete");
  });

  res.status(200).json({ message: "Image generation started" });
}
