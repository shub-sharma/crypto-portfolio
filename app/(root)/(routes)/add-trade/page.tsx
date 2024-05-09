"use client";

import { useState } from "react";
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

  console.log(`default ${tradeInfoDefault}`);
  const [tradeInfo, setTradeInfo] = useState(tradeInfoDefault);

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

  return (
    // <div className="border border-cyan-50 bg-primary/10">Hello world</div>
    <TradeForm
      tickersList={[
        { BTC: "bitcoin" },
        { ETH: "Ethereum" },
        { SOL: "soylana" },
      ]}
      tradeType="Add"
      tradeInfo={tradeInfo}
      setTradeInfo={setTradeInfo}
      submitting={submitting}
      handleSubmit={addTrade}
    />
  );
};

export default AddTrade;
