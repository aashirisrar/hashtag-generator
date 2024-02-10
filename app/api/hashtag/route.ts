import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

// code to instruct for specific response
const instructionMessage = {
  role: "system",
  content:
    "You are a hashtag generator. Write the best hashtags that will rank on social media apps. You must answer only in hashtags for",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
