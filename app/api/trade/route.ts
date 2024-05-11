import Trade from "@/models/trade";
import { signInAndGetSession } from "@/utils/get-session";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { ticker, type, date, amount, price } = body;
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!ticker || !type || !date || !amount || !price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    // connect to db
    const dbUserId = await signInAndGetSession();
    Trade;
    const newTrade = new Trade({
      holder: dbUserId,
      ticker,
      type,
      date,
      amount,
      price,
    });

    await newTrade.save();
    return new NextResponse(JSON.stringify(newTrade), { status: 201 });
  } catch (error) {
    console.log("[TRADE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// import Prompt from "@models/prompt";
// import { connectToDB } from "@utils/database";

// export const POST = async (request) => {
//     const { userId, prompt, tag } = await request.json();

//     try {
//         await connectToDB();
//         const newPrompt = new Prompt({ creator: userId, prompt, tag });

//         await newPrompt.save();
//         return new Response(JSON.stringify(newPrompt), { status: 201 })
//     } catch (error) {
//         return new Response("Failed to create a new prompt", { status: 500 });
//     }
// }
