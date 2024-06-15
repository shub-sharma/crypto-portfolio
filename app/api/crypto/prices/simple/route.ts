import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const tickersList = await req.json();
    if (!tickersList || !Array.isArray(tickersList)) {
      return new NextResponse("Tickers list is required and must be an array", {
        status: 400,
      });
    }
    if (tickersList.length === 0) {
      return new NextResponse("Ticker list must be greater than 0", {
        status: 200,
      });
    }

    const response = await fetch(
      `${process.env.COINGECKO_API_URI}/coins/markets?ids=${tickersList.join(
        ","
      )}&vs_currency=usd&precision=2&price_change_percentage=1h,24h,7d,30d,1y`
    );

    if (!response.ok) {
      throw new NextResponse("Failed to obtain tickers list prices", {
        status: 500,
      });
    }
    const jsonData = await response.json();

    const transformedData = jsonData.reduce((acc, coin) => {
      acc[coin.id] = {
        symbol: coin.symbol,
        image: coin.image,
        name: coin.name,
        price_usd: coin.current_price,
        usd_24h_percent_change: coin.price_change_percentage_24h_in_currency,
        usd_1h_percent_change: coin.price_change_percentage_1h_in_currency,
        usd_30d_percent_change: coin.price_change_percentage_30d_in_currency,
        usd_7d_percent_change: coin.price_change_percentage_7d_in_currency,
        usd_1y_percent_change: coin.price_change_percentage_1y_in_currency,
      };
      return acc;
    }, {});

    // console.log("JSON Data: ", jsonData);

    // console.log("Data returned: ", transformedData);

    // bitcoin: { usd: 69996.4, usd_24h_change: 5.491128320065069 },
    // ethereum: { usd: 3403.56, usd_24h_change: 10.62600124711219 },
    // ripple: { usd: 0.53, usd_24h_change: 4.8177733104448395 },
    // solana: { usd: 183.04, usd_24h_change: 7.912279764254268 }

    return new NextResponse(JSON.stringify(transformedData), { status: 200 });
  } catch (error) {
    console.log("[CRYPTO SIMPLE POST]", error);
    return new NextResponse(
      "Internal server while getting tickers list price data",
      {
        status: 500,
      }
    );
  }
}
