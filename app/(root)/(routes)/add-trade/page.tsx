"use client";

import { useEffect, useState } from "react";
import { getAuth } from "@clerk/nextjs/server";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

import { TradeForm } from "@/components/trade-form";

const AddTrade = () => {
  const router = useRouter();
  // const { userId } = getAuth();
  const userId = "test";
  const [submitting, setIsSubmitting] = useState(false);
  const tradeInfoDefault = {
    userId: userId || "",
    ticker: "",
    type: "",
    date: new Date(),
    amount: 0,
    price: 0,
  };

  // console.log("default", tradeInfoDefault);
  const [tradeInfo, setTradeInfo] = useState(tradeInfoDefault);
  const [tickersList, setTickersList] = useState([]);

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
    const fetchData = async () => {
      try {
        const response = await fetch("markets.json");
        const jsonData = await response.json();

        const tickers = jsonData.map((ticker) => ({
          label: `${ticker.name} (${ticker.symbol.toUpperCase()})`,
          value: ticker.id,
        }));
        // console.log(tickers);

        setTickersList(tickers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run effect only once

  // TODO: Ticker used in the form object needs to be mapped back for edit form, currently form uses (Name (Ticker)), but we need ID.

  return (
    // <div className="border border-cyan-50 bg-primary/10">Hello world</div>
    <TradeForm
      // tickersList={[
      //   { BTC: "bitcoin" },
      //   { ETH: "Ethereum" },
      //   { SOL: "soylana" },
      // ]}
      tickersList={tickersList}
      tradeType="Add"
      tradeInfo={undefined}
      setTradeInfo={setTradeInfo}
      submitting={submitting}
      handleSubmit={addTrade}
    />
  );
};

export default AddTrade;
