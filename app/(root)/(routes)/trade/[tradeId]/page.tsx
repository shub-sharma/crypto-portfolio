"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { Separator } from "@/components/ui/separator";

import { TradeForm } from "@/components/trade-form";
import { json } from "stream/consumers";

interface TradeIdPageProps {
  params: {
    tradeId: string;
  };
}

const TradeIdPage = ({ params }: TradeIdPageProps) => {
  const router = useRouter();
  // const { userId } = getAuth();
  const userId = "test";
  const [submitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const tradeInfoDefault = {
    userId: userId || "",
    ticker: "",
    type: "",
    date: new Date(),
    amount: 0,
    price: 0,
  };

  // console.log("default", tradeInfoDefault);
  const [tradeInfo, setTradeInfo] = useState({});
  const [testTradeInfo, setTestTradeInfo] = useState({});

  const [errorMessage, setErrorMessage] = useState("");

  const [tickersList, setTickersList] = useState([]);
  const [tradeType, setTradeType] = useState("Add");

  const tradeIdParam = params.tradeId;
  const addTrade = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/trade/add", {
        method: "POST",
        body: JSON.stringify(tradeInfo),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const tickerList = ["btc", "eth", "sol"];

  useEffect(() => {
    console.log("test");
    const fetchData = async () => {
      try {
        const response = await fetch("/api/crypto/tickers");

        if (!response.ok) {
          setErrorMessage("Failed to obtain tickers list");
        }
        const jsonData = await response.json();
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

          setTestTradeInfo({
            tradeId: data._id,
            type: data.type,
            amount: data.amount,
            price: data.price,
            // date: new Date(data.date),
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
  }, [tradeIdParam]); // Empty dependency array to run effect only once

  // TODO: Ticker used in the form object needs to be mapped back for edit form, currently form uses (Name (Ticker)), but we need ID.

  return (
    <>
      {loading === false && Object.keys(tradeInfo).length > 0 ? (
        <TradeForm
          tickersList={tickersList}
          tradeType={tradeType}
          initialTradeInfoData={
            Object.keys(tradeInfo).length === 0 ? null : tradeInfo
          }
          setTradeInfo={setTradeInfo}
          submitting={submitting}
          handleSubmit={addTrade}
        />
      ) : errorMessage.length > 0 ? (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">
                {tradeType} Trade Failed 😞
              </h3>
              <p className="text-sm text-muted-foreground">
                Please verify the trade id exists. {errorMessage}
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
        </div>
      ) : (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">Loading...</h3>
              <p className="text-sm text-muted-foreground">Please wait</p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
        </div>
      )}
    </>
  );
};

export default TradeIdPage;
