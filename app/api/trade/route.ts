import Trade from "@/models/trade";
import { signInAndGetSession } from "@/utils/get-session";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { ticker, type, date, amount, price, symbol, name, image } = body;
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!ticker || !type || !date || !amount || !price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    // connect to db
    const dbUserId = await signInAndGetSession();
    const newTrade = new Trade({
      holder: dbUserId,
      ticker,
      type,
      date,
      amount,
      price,
      symbol,
      name,
      image,
    });

    console.log("adding new trade: ", newTrade);

    await newTrade.save();
    return new NextResponse(JSON.stringify(newTrade), { status: 201 });
  } catch (error) {
    console.log("[TRADE POST]", error);
    return new NextResponse("Internal server while creating trade", {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const dbUserId = await signInAndGetSession();

    const trades = await Trade.find({ holder: dbUserId })
      .populate({
        path: "holder",
        model: User,
      })
      .sort({ date: "desc" });

    return new NextResponse(JSON.stringify(trades), { status: 200 });
  } catch (error) {
    console.log("[TRADE GET]", error);
    return new NextResponse("Internal server while retrieving trades", {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const dbUserId = await signInAndGetSession();

    const body = await req.json();
    const { ticker } = body;

    // Delete all trades for the given ticker name for the holder

    const trades = await Trade.deleteMany({
      holder: dbUserId,
      ticker: ticker,
    }).populate({
      path: "holder",
      model: User,
    });

    console.log(trades);

    return new NextResponse(JSON.stringify(trades), { status: 200 });
  } catch (error) {
    console.log("[TRADE DELETE]", error);
    return new NextResponse("Internal server while deleting trades", {
      status: 500,
    });
  }
}
