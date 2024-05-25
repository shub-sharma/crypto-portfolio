"use client";
import { UserButton } from "@clerk/nextjs";
import { SearchInput } from "@/components/search-input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import {
  calculateHoldings,
  formatDollar,
  getPercentageChange,
  calculateHoldingsSummary,
  getHoldingsTableData,
  transformHistoricalCoinsData,
} from "@/utils/crypto-utils";
import { Header } from "@/components/header";
import { Percent, DollarSign, Briefcase, TrendingUp } from "lucide-react";
import GenericCard from "@/components/generic-card";

import { DataTable } from "@/components/holdings-table/data-table";
import { columns } from "@/components/holdings-table/columns";

const RootPage = () => {
  const [trades, setTrades] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [holdingsSummary, setHoldingsSummary] = useState({});
  const [holdingsTableData, setHoldingsTableData] = useState([]);
  const [historicalChartData, setHistoricalChartData] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tradeResponse = await fetch("/api/trade");

        if (!tradeResponse.ok) {
          setErrorMessage("Failed to obtain trades");
        }
        // Fetch user's trades
        const tradeJsonData = await tradeResponse.json();
        setTrades(tradeJsonData);
        console.log(tradeJsonData);

        const holdings = calculateHoldings(tradeJsonData);
        console.log(holdings);
        setHoldings(holdings);

        const tickersList = Object.keys(holdings);
        // Fetch current market price data for cards
        const simplePricesResponse = await fetch("/api/crypto/prices/simple", {
          method: "POST",
          body: JSON.stringify(tickersList),
        });

        if (!simplePricesResponse.ok) {
          setErrorMessage("Failed to obtain crypto price data");
        }
        const simplePricesJsonData = await simplePricesResponse.json();
        console.log(simplePricesJsonData);

        const holdingsSummary = calculateHoldingsSummary(
          simplePricesJsonData,
          holdings
        );

        console.log("holdings summary", holdingsSummary);

        // TODO: Charts stuff, need to get a api rate limit increase to use this :(
        // Only show chart on click in the table.
        // // Generate the chart data based on tickers list
        // const historicalPricesResponse = await fetch(
        //   "/api/crypto/prices/historical",
        //   {
        //     method: "POST",
        //     body: JSON.stringify({ tickersList, days: 365 }),
        //   }
        // );

        // if (!historicalPricesResponse.ok) {
        //   setErrorMessage("Failed to obtain crypto historical price data");
        // }
        // const historicalPriceJsonData = await historicalPricesResponse.json();
        // console.log(historicalPriceJsonData);

        // const transformedChartData = transformHistoricalCoinsData(
        //   historicalPriceJsonData,
        //   holdings
        // );

        setHistoricalChartData([]);

        setHoldingsSummary(holdingsSummary);
        setHoldingsTableData(
          getHoldingsTableData(simplePricesJsonData, holdings)
        );
      } catch (error) {
        setErrorMessage(`Error fetching data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading === false ? (
        <div className="h-full p-4 space-y-2 max-w-7xl mx-auto">
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                {trades.length > 0
                  ? "Monitor your cryptocurrency holdings (in USD)"
                  : "Add some trades to view your holdings"}
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GenericCard
              title="Total Cost Basis"
              content={formatDollar(holdingsSummary["total_cost_basis"], 2)}
              icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
              description="All time"
              description_percent_change={undefined}
            />
            <GenericCard
              title="Holdings"
              content={formatDollar(holdingsSummary["total_holdings_value"], 2)}
              icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
              description={`${Object.keys(holdings).length} assets`}
              description_percent_change={undefined}
            />
            <GenericCard
              title="Net Profit"
              content={formatDollar(holdingsSummary["net_profit"]["value"], 2)}
              icon={<TrendingUp className="h-6 w-6 text-muted-foreground" />}
              description_percent_change={
                holdingsSummary["net_profit"]["percentage"]
              }
              description={undefined}
            />
            <GenericCard
              title="1d Change"
              content={formatDollar(
                holdingsSummary["one_day_change_value"]["value"],
                2
              )}
              icon={<Percent className="h-6 w-6 text-muted-foreground" />}
              description_percent_change={
                holdingsSummary["one_day_change_value"]["percentage"]
              }
              description={undefined}
            />
          </div>
          <DataTable columns={columns} data={holdingsTableData} />
        </div>
      ) : errorMessage.length > 0 ? (
        <Header title="Empty Dashboard" message={errorMessage} />
      ) : (
        <Header title="Loading..." message="Please wait" />
      )}
    </>
  );
};

export default RootPage;
