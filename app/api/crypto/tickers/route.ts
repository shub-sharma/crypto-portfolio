import { NextResponse } from "next/server";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-pro-api-key": process.env.COINGECKO_API_KEY,
  },
};

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

    for (let page = 1; page < 5; page++) {
      try {
        const response = await fetch(
          `${process.env.COINGECKO_API_URI}/coins/markets?vs_currency=usd&per_page=250&page=${page}`,
          options
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
        console.log(`Fetched data for page ${page}`);
      } catch (error) {
        console.error(error);
      }
    }

    return new NextResponse(JSON.stringify(allData), { status: 200 });
  } catch (error) {
    console.log("[CRYPTO GET]", error);
    return new NextResponse(
      "Internal server while updating trade information",
      { status: 500 }
    );
  }
}
