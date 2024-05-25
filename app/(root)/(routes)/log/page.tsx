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
  getTradeTableData,
} from "@/utils/crypto-utils";
import { Header } from "@/components/header";
import { Percent, DollarSign, Briefcase, TrendingUp } from "lucide-react";
import GenericCard from "@/components/generic-card";

import { DataTable } from "@/components/trades-table/data-table";
import { columns } from "@/components/trades-table/columns";

const RootPage = () => {
  const [tradesTableData, setTradesTableData] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tradeResponse = await fetch("/api/trade");
        console.log("statement here");
        if (!tradeResponse.ok) {
          setErrorMessage("Failed to obtain trades");
        }
        // Fetch user's trades

        const tradeJsonData = await tradeResponse.json();

        const tradesTableData = tradeJsonData.map((trade: any) => {
          return {
            ...trade,
            amount_in_usd: trade.amount * trade.price,
          };
        });

        console.log(tradesTableData);
        setTradesTableData(tradesTableData);

        // getTradeTableData(simplePricesJsonData, tradeJsonData);
        // setTradesTableData();
        console.log("Trades data is: ", tradesTableData);
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
              <h3 className="text-lg font-medium">Trade Log</h3>
              <p className="text-sm text-muted-foreground">
                {tradesTableData.length > 0
                  ? "Edit your cryptocurrency trades here"
                  : "Add some trades to view the log"}
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <DataTable columns={columns} data={tradesTableData} />
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
