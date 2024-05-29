"use client";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import GenericCard from "@/components/generic-card";

import { DataTable } from "@/components/leaderboard-table/data-table";
import { columns } from "@/components/leaderboard-table/columns";
import { getLeaderboardTableData } from "@/utils/crypto-utils";

const Leaderboard = () => {
  const [leaderboardtableData, setLeaderboardTableData] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboardResponse = await fetch("/api/trade/leaderboard");
        if (!leaderboardResponse.ok) {
          setErrorMessage("Failed to obtain leaderboard data");
        }
        const leaderboardJsonResponse = await leaderboardResponse.json();

        const simplePricesResponse = await fetch("/api/crypto/prices/simple", {
          method: "POST",
          body: JSON.stringify(leaderboardJsonResponse.tickersToQuery),
        });

        if (!simplePricesResponse.ok) {
          setErrorMessage("Failed to obtain crypto price data");
        }
        const simplePricesJsonData = await simplePricesResponse.json();
        console.log(simplePricesJsonData);

        const tableData = getLeaderboardTableData(
          simplePricesJsonData,
          leaderboardJsonResponse.allInvestors
        );

        setLeaderboardTableData(tableData);
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
              <h3 className="text-lg font-medium">Crypto Leaderboard</h3>
              <p className="text-sm text-muted-foreground">
                {leaderboardtableData.length > 0
                  ? "View your rankings amongst the best investors"
                  : "Currently no investors to view..."}
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <DataTable columns={columns} data={leaderboardtableData} />
        </div>
      ) : errorMessage.length > 0 ? (
        <Header title="Empty Dashboard" message={errorMessage} />
      ) : (
        <Header title="Loading..." message="Please wait" />
      )}
    </>
  );
};

export default Leaderboard;
