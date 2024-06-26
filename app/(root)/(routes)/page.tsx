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

  const headerColumnMapping = {
    price_usd: "Price",
    amount_in_usd: "Holding",
    costBasis: "Total Cost",
    net_profit: "Net Profit",
    usd_1h_percent_change: "1h %",
    usd_24h_percent_change: "24h %",
    usd_7d_percent_change: "7d %",
  };

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
        setHoldings(holdings);

        const tickersList = Object.keys(holdings);
        if (tickersList.length > 0) {
          // Fetch current market price data for cards
          const simplePricesResponse = await fetch(
            "/api/crypto/prices/simple",
            {
              method: "POST",
              body: JSON.stringify(tickersList),
            }
          );

          if (!simplePricesResponse.ok) {
            setErrorMessage("Failed to obtain crypto price data");
          }
          const simplePricesJsonData = await simplePricesResponse.json();

          const holdingsSummary = calculateHoldingsSummary(
            simplePricesJsonData,
            holdings
          );

          setHoldingsSummary(holdingsSummary);

          const modifiedArray = getHoldingsTableData(
            simplePricesJsonData,
            holdings
          ).map((item) => {
            const modifiedItem = {};
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                const newKey = headerColumnMapping[key] || key;
                modifiedItem[newKey] = item[key];
              }
            }
            return modifiedItem;
          });
          setHoldingsTableData(modifiedArray);
        }
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
        <div className="h-full p-4 space-y-2 max-w-[100rem] mx-auto">
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
          {Object.keys(holdingsSummary).length > 0 ? (
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
                content={formatDollar(
                  holdingsSummary["total_holdings_value"],
                  2
                )}
                icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
                description={`${Object.keys(holdings).length} assets`}
                description_percent_change={undefined}
              />
              <GenericCard
                title="Net Profit"
                content={formatDollar(
                  holdingsSummary["net_profit"]["value"],
                  2
                )}
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
          ) : (
            <></>
          )}

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
