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
const RootPage = () => {
  const [trades, setTrades] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [holdingsSummary, setHoldingsSummary] = useState({});
  const [holdingsTableData, setHoldingsTableData] = useState({});

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
      Object.keys(holdingsSummary).length > 0 ? (
        <div className="h-full p-4 space-y-2 max-w-7xl mx-auto">
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your cryptocurrency holdings
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GenericCard
              title="Total Cost Basis (USD)"
              content={formatDollar(holdingsSummary["total_cost_basis"])}
              icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
              description="All time"
            />
            <GenericCard
              title="Holdings (USD)"
              content={formatDollar(holdingsSummary["total_holdings_value"])}
              icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
              description={`${Object.keys(holdings).length} assets`}
            />
            <GenericCard
              title="Net Profit (USD)"
              content={formatDollar(holdingsSummary["net_profit"]["value"])}
              icon={<TrendingUp className="h-6 w-6 text-muted-foreground" />}
              description={`${holdingsSummary["net_profit"]["percentage"]}%`}
            />
            <GenericCard
              title="1d Change"
              content={formatDollar(
                holdingsSummary["one_day_change_value"]["value"]
              )}
              icon={<Percent className="h-6 w-6 text-muted-foreground" />}
              description={`${holdingsSummary["one_day_change_value"]["percentage"]}%`}
            />
          </div>
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
