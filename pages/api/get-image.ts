// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

// open IA config
import { Configuration, OpenAIApi } from "openai"
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {

  const prompt = req.body.text
  if (!prompt) return res.status(400).json({ message: "Bad request" });

  const { data } = await openai.createImage({ prompt, n: 2, size: "512x512" })

  res.status(200).json({ data });
});

export default handler;
