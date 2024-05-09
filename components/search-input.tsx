"use client";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const router = useRouter();
  //   const searchParams = useSearchParams();

  const [ticker, setTicker] = useState("BTC");

  const debouncedTickerValue = useDebounce<string>(ticker);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTicker(e.target.value);
  };

  useEffect(() => {
    console.log("query: ", debouncedTickerValue);
  }, [debouncedTickerValue]);

  return (
    //May be useful when searching the leaderboards
    <div className="relative">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input
        placeholder={ticker}
        value={ticker}
        onChange={onChange}
        className="pl-10 bg-primary/10"
      />
    </div>
  );
};
