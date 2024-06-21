import { NextResponse } from "next/server";

/**
 * Gets a list of top 1000 crypto tickers
 *
 */
export async function GET(
  req: Request,
  { params }: { params: { tradeId: string } }
) {
  try {
    const allData = [];

    for (let page = 1; page < 3; page++) {
      try {
        const response = await fetch(
          `${process.env.COINGECKO_API_URI}/coins/markets?vs_currency=usd&per_page=250&page=${page}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`
        );

        if (!response.ok) {
          throw new NextResponse("Failed to obtain tickers list", {
            status: 500,
          });
        }
        const jsonData = await response.json();

        const tickers = jsonData.map((ticker) => ({
          name: ticker.name,
          id: ticker.id,
          symbol: ticker.symbol,
        }));
        allData.push(...tickers);
      } catch (error) {
        console.error(error);
      }
    }

    return new NextResponse(JSON.stringify(allData), { status: 200 });
  } catch (error) {
    console.log("[CRYPTO GET]", error);
    return new NextResponse("Internal server while obtaining tickers list", {
      status: 500,
    });
  }
}
