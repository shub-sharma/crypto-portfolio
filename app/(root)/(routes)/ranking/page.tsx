"use client";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";

import { DataTable } from "@/components/leaderboard-table/data-table";
import { columns } from "@/components/leaderboard-table/columns";
import { getLeaderboardTableData } from "@/utils/crypto-utils";
import { useRouter } from "next/navigation";

const Leaderboard = () => {
  const router = useRouter();

  const [leaderboardtableData, setLeaderboardTableData] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const headerColumnMapping = {
    one_hour_change_percentage: "1h %",
    one_day_change_percentage: "1d %",
    seven_day_change_percentage: "7d %",
    one_year_change_percentage: "1y %",
    total_holdings_value: "holding",
  };

  const userRedirect = (rowData: any) => {
    router.push(`/profile/${rowData.id}`);
  };

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
        // console.log(simplePricesJsonData);

        const tableData = getLeaderboardTableData(
          simplePricesJsonData,
          leaderboardJsonResponse.allInvestors
        );

        const modifiedArray = tableData.map((item) => {
          const modifiedItem = {};
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              const newKey = headerColumnMapping[key] || key;
              modifiedItem[newKey] = item[key];
            }
          }
          return modifiedItem;
        });

        setLeaderboardTableData(modifiedArray);
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
              <h3 className="text-lg font-medium">Crypto Leaderboard</h3>
              <p className="text-sm text-muted-foreground">
                {leaderboardtableData.length > 0
                  ? "View your ranking amongst the best investors"
                  : "Currently no investors to view..."}
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <DataTable
            userRedirect={userRedirect}
            columns={columns}
            data={leaderboardtableData}
          />
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
