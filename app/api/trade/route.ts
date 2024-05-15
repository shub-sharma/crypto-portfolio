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
    console.log("[TRADE POST]", error);
    return new NextResponse("Internal server while creating trade", {
      status: 500,
    });
  }
}
