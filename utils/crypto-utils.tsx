interface TradeInfo {
  ticker: string;
  _id: string;
  type: string;
  date: Date;
  amount: number;
  price: number;
}

export const calculateHoldings = (trades: TradeInfo[]) => {
  const holdings: any = {};

  trades.forEach((trade) => {
    const { type, ticker, amount, price, _id } = trade;

    if (!holdings[ticker]) {
      holdings[ticker] = { amount: 0, costBasis: 0 };
    }

    if (type === "Buy") {
      holdings[ticker]["amount"] += amount;
      holdings[ticker]["costBasis"] += amount * price;
      // Only get the last added Buy transaction to edit.
      holdings[ticker]["tradeId"] = _id;
    } else if (type === "Sell") {
      holdings[ticker]["amount"] -= amount;
      if (holdings[ticker]["amount"] <= 0) {
        delete holdings[ticker];
      }
    }
  });

  return holdings;
};

export const sumValues = (numArray: any) => {
  return numArray.reduce((accumulator: number, currentValue: number) => {
    return accumulator + currentValue;
  }, 0);
};

export const formatDollar = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

export const getPercentageChange = (
  currentPrice: number,
  boughtPrice: number
) => {
  if (boughtPrice === 0) {
    return 0;
  }

  const percentageChange = ((currentPrice - boughtPrice) / boughtPrice) * 100;

  return percentageChange.toFixed(2);
};

export const calculateHoldingsSummary = (livePrices: any, holdings: any) => {
  let totalCostBasis = 0;
  let totalHoldingsValue = 0;
  let totalOneDayChangeValue = 0;

  for (const [key, value] of Object.entries(holdings)) {
    const livePrice = livePrices[key];
    if (livePrice) {
      const holdingValue = value.amount * livePrice.price_usd;
      totalCostBasis += value.costBasis;
      totalHoldingsValue += holdingValue;
      totalOneDayChangeValue +=
        (holdingValue * livePrice.usd_24h_percent_change) / 100;
    }
  }

  const netProfit = totalHoldingsValue - totalCostBasis;
  const netProfitPercentage = ((netProfit / totalCostBasis) * 100).toFixed(2);
  const oneDayChangePercentage = (
    (totalOneDayChangeValue / totalHoldingsValue) *
    100
  ).toFixed(2);
  return {
    total_cost_basis: totalCostBasis,
    total_holdings_value: totalHoldingsValue,
    net_profit: {
      value: netProfit,
      percentage: netProfitPercentage,
    },
    one_day_change_value: {
      value: totalOneDayChangeValue,
      percentage: oneDayChangePercentage,
    },
  };
};

export const getHoldingsTableData = (livePrices: any, holdings: any) => {
  const combinedArr = [];

  for (const key in livePrices) {
    if (livePrices.hasOwnProperty(key)) {
      const coinData = {
        ...livePrices[key],
        ...holdings[key],
        id: livePrices.id,
      };

      const percentChangeKeys = [
        "usd_24h_percent_change",
        "usd_1h_percent_change",
        "usd_30d_percent_change",
        "usd_1y_percent_change",
      ];

      percentChangeKeys.forEach((changeKey) => {
        const percentChange = coinData[changeKey];
        if (percentChange !== undefined) {
          const actualChangeKey = changeKey.replace("percent", "actual");
          coinData[actualChangeKey] =
            (percentChange / 100) * coinData.price_usd;
        }
      });
      combinedArr.push(coinData);
    }
  }
  console.log(combinedObject);
  return combinedObject;
};
