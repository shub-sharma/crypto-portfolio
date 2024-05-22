import Trade from "@/models/trade";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { tradeId: string } }
) {
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

    if (!params.tradeId) {
      return new NextResponse("Trade ID is required", { status: 400 });
    }

    await connectToDB();

    // Find the existing trade by ID
    const existingTrade = await Trade.findById(params.tradeId);

    if (!existingTrade) {
      return new NextResponse("Trade ID not found", { status: 404 });
    }
    existingTrade.ticker = ticker;
    existingTrade.type = type;
    existingTrade.date = date;
    existingTrade.amount = amount;
    existingTrade.price = price;
    // Update the trade with new data

    await existingTrade.save();

    return new NextResponse(JSON.stringify(existingTrade), { status: 201 });
  } catch (error) {
    console.log("[TRADE PATCH]", error);
    return new NextResponse(
      "Internal server while updating trade information",
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { tradeId: string } }
) {
  try {
    await connectToDB();

    const trade = await Trade.findById(params.tradeId).populate({
      path: "holder",
      model: User,
    });
    console.log(trade);
    if (!trade) {
      return new NextResponse("Trade ID not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(trade), { status: 201 });
  } catch (error) {
    console.log("[TRADE GET]", error);
    return new NextResponse("Internal server while retrieving trades", {
      status: 500,
    });
  }
}
