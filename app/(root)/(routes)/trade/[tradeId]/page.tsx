"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { Separator } from "@/components/ui/separator";

import { TradeForm } from "@/components/trade-form";

import { Header } from "@/components/header";

interface TradeIdPageProps {
  params: {
    tradeId: string;
  };
}

const TradeIdPage = ({ params }: TradeIdPageProps) => {
  const [loading, setLoading] = useState(true);
  const [tradeInfo, setTradeInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [tickersList, setTickersList] = useState([]);
  const [tickersListRaw, setTickersRaw] = useState([]);

  const [tradeType, setTradeType] = useState("Add");

  const tradeIdParam = params.tradeId;

  useEffect(() => {
    console.log("test");
    const fetchData = async () => {
      try {
        const response = await fetch("/api/crypto/tickers");

        if (!response.ok) {
          setErrorMessage("Failed to obtain tickers list");
        }
        const jsonData = await response.json();

        setTickersRaw(jsonData);

        console.log("ticker data: ", jsonData);
        console.log(jsonData);
        const tickers = jsonData.map((ticker) => ({
          label: `${ticker.name} (${ticker.symbol.toUpperCase()})`,
          value: ticker.id,
        }));
        console.log(tickers);

        setTickersList(tickers);

        const getTradeInfo = async () => {
          const response = await fetch(`/api/trade/${tradeIdParam}`);
          if (!response.ok) {
            setErrorMessage(
              `Failed to obtain trade info for id: ${tradeIdParam}`
            );
          }
          const data = await response.json();
          setTradeInfo({
            tradeId: data._id,
            type: data.type,
            amount: data.amount,
            price: data.price,
            ticker: data.ticker,
            date: new Date(data.date),
          });

          console.log("got trade info", data);
        };
        if (tradeIdParam && tradeIdParam !== "new") {
          console.log("getting trade info");
          getTradeInfo();
          setTradeType("Edit");
        }
      } catch (error) {
        setErrorMessage(`Error fetching data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tradeIdParam]);

  return (
    <>
      {loading === false &&
      (Object.keys(tradeInfo).length > 0 || tradeIdParam === "new") ? (
        <TradeForm
          tickersList={tickersList}
          tickersListRaw={tickersListRaw}
          tradeType={tradeType}
          initialTradeInfoData={
            Object.keys(tradeInfo).length === 0 ? null : tradeInfo
          }
        />
      ) : errorMessage.length > 0 ? (
        <Header
          title="Trade Failed 😞"
          message={`Please verify the trade id exists: ${errorMessage}`}
        />
      ) : (
        <Header title="Loading..." message="Please wait" />
      )}
    </>
  );
};

export default TradeIdPage;
