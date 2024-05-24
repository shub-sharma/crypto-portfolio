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

        setHoldingsSummary(
          calculateHoldingsSummary(simplePricesJsonData, holdings)
        );

        setHoldingsTableData(
          getHoldingsTableData(simplePricesJsonData, holdings)
        );

        // Use the prices got from previous call + a call to ticker list's image via coingecko. Combine them to get a list of assets to display in table data.

        // setTickersList(tickers);
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
      {loading === false &&
      trades.length > 0 &&
      Object.keys(holdingsSummary).length > 0 &&
      holdingsTableData.length > 0 ? (
        <div className="h-full p-4 space-y-2 max-w-7xl mx-auto">
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your cryptocurrency holdings (in USD)
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
