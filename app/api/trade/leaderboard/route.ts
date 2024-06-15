import Trade from "@/models/trade";
import { signInAndGetSession, generateFakeData } from "@/utils/get-session";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { calculateHoldings } from "@/utils/crypto-utils";
export async function GET() {
  try {
    const dbUserId = await signInAndGetSession();

    const publicUsers = await User.find({ public: true });

    console.log(publicUsers);

    const allInvestors = [];
    const uniqueTickersToquery: any = [];
    for (let i = 0; i < publicUsers.length; i++) {
      const holderId = publicUsers[i]._id;
      const trades = await Trade.find({ holder: holderId })
        .populate({
          path: "holder",
          model: User,
        })
        .sort({ date: "desc" });
      // console.log("trades: ", trades);

      const holdings = calculateHoldings(trades);

      Object.keys(holdings).forEach((holding: any) => {
        if (!uniqueTickersToquery.includes(holding))
          uniqueTickersToquery.push(holding);
      });

      allInvestors.push({ user: publicUsers[i], holdings });
    }

    return new NextResponse(
      JSON.stringify({ tickersToQuery: uniqueTickersToquery, allInvestors }),
      { status: 200 }
    );
  } catch (error) {
    console.log("[TRADE GET]", error);
    return new NextResponse("Internal server while retrieving trades", {
      status: 500,
    });
  }
}
