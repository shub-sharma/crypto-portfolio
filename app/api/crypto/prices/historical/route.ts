import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Body received", body);
    const { tickersList, days } = body;
    if (!tickersList || !Array.isArray(tickersList)) {
      return new NextResponse(
        "Tickers list and is required and must be an array",
        {
          status: 400,
        }
      );
    }

    if (!days) {
      return new NextResponse("Number of days is required", {
        status: 400,
      });
    }
    const allData: any[] = [];

    tickersList.forEach(async (ticker) => {
      try {
        const response = await fetch(
          `${process.env.COINGECKO_API_URI}/coins/${ticker}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`
        );

        if (!response.ok) {
          throw new NextResponse("Failed to obtain tickers list", {
            status: 500,
          });
        }
        const jsonData = await response.json();
        const coinData = {
          [ticker]: jsonData.prices,
        };
        console.log("historical data: ", coinData);

        allData.push(coinData);
      } catch (error) {
        console.error(error);
      }
    });

    console.log(`Fetched historical data ${allData}`);

    return new NextResponse(JSON.stringify(allData), { status: 200 });
  } catch (error) {
    console.log("[CRYPTO SIMPLE POST]", error);
    return new NextResponse(
      "Internal server while getting tickers list historical price data",
      {
        status: 500,
      }
    );
  }
}
