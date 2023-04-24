// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

// open IA config
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const prompt = req.body.text;
    const type = req.body.type;

    if (!prompt || !type) return res.status(400).json({ message: "Bad request" });

    if (!["chat", "image"].includes(type))
      return res.status(400).json({ message: `${type} is not recognized as a valid prompt` });


    let data = null;
    switch (type) {
      case "chat":
        let chatRes = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        data = chatRes?.data;
        break;

      case "image":
        let imgRes = await openai.createImage({ prompt, n: 2, size: "512x512" });
        data = imgRes.data;
        break;

      default:
        break;
    }

    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err?.response?.data?.error });
  }
});

export default handler;
