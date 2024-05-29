import { connectToDB } from "@/utils/database";
import User from "@/models/user";

import Trade from "@/models/user";

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const signInAndGetSession = async () => {
  try {
    const user = await currentUser();

    const userImage = user?.imageUrl;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    // check if user already exists
    const userExists = await User.findOne({ userId: user.id });

    // if not, create a new document and save user in MongoDB
    if (!userExists) {
      const newUser = await User.create({
        userId: user.id,
        username: user.firstName,
        public: false,
        image: userImage,
      });
      console.log("new user", newUser);
      return newUser._id.toString();
    }
    console.log("User exists", userExists);

    return userExists._id.toString();
  } catch (error: any) {
    console.log("Error checking if user exists: ", error.message);
    return "";
  }
};

export const generateFakeData = async () => {
  // Clear existing data

  const influentialPeople = [
    {
      name: "Satoshi Nakamoto",
      curr_name: "Bitcoin",
      ticker: "bitcoin",
      symbol: "btc",
      amount: 1000000,
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    },
    {
      name: "Vitalik Buterin",
      ticker: "ethereum",
      curr_name: "Ethereum",
      symbol: "eth",
      amount: 335000,
      image:
        "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    },
    {
      name: "Changpeng Zhao (CZ)",
      ticker: "binancecoin",
      curr_name: "BNB",
      symbol: "bnb",
      amount: 2000000,
      image:
        "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
    },
    {
      name: "Tyler Winklevoss",
      ticker: "bitcoin",
      curr_name: "Bitcoin",
      symbol: "btc",
      amount: 150000,
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    },
    {
      name: "Cameron Winklevoss",
      ticker: "bitcoin",
      curr_name: "Bitcoin",
      symbol: "btc",
      amount: 150000,
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    },
    {
      name: "Michael Saylor",
      ticker: "bitcoin",
      curr_name: "Bitcoin",
      symbol: "btc",
      amount: 17732,
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    },
    {
      name: "Elon Musk",
      ticker: "bitcoin",
      curr_name: "Bitcoin",
      symbol: "btc",
      amount: 100000,
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    },
    {
      name: "Charles Hoskinson",
      ticker: "cardano",
      curr_name: "Cardano",
      symbol: "ada",
      amount: 5000000,
      image:
        "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
    },
    {
      name: "Gavin Wood",
      ticker: "polkadot",
      symbol: "dot",
      curr_name: "Polkadot",
      amount: 3000000,
      image:
        "https://assets.coingecko.com/coins/images/12171/large/polkadot.png?1639712644",
    },
    {
      name: "Brian Armstrong",
      ticker: "bitcoin",
      curr_name: "Bitcoin",
      symbol: "btc",
      amount: 50000,
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    },
    {
      name: "Joseph Lubin",
      ticker: "ethereum",
      symbol: "eth",
      curr_name: "Ethereum",
      amount: 150000,
      image:
        "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    },
    {
      name: "Justin Sun",
      ticker: "tron",
      symbol: "trx",
      curr_name: "TRON",
      amount: 6000000000,
      image:
        "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1547035066",
    },
    {
      name: "Chris Larsen",
      ticker: "ripple",
      curr_name: "Ripple",
      symbol: "xrp",
      amount: 5000000000,
      image:
        "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731",
    },
    {
      name: "Andreas Antonopoulos",
      ticker: "bitcoin",
      curr_name: "Bitcoin",
      symbol: "btc",
      amount: 50000,
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    },
  ];

  try {
    for (let i = 0; i < influentialPeople.length; i++) {
      const person = influentialPeople[i];
      const user = {
        userId: Math.random() * 1000 + 1,
        username: person.name,
        public: true,
        image: `/assets/${person.name.split(" ")[0].toLowerCase()}.png`,
      };
      console.log(user);
      // const newUser = await User.create();
      // console.log("new user id created ", newUser._id.toString());

      const tradeDetails = {
        holder: "replaceme",
        ticker: person.ticker,
        type: "Buy",
        date: new Date("2015-01-01"),
        amount: person.amount,
        price: 50, // Random price for example
        symbol: person.symbol,
        name: person.curr_name,
        image: person.image,
      };
      console.log(tradeDetails);

      // if (newUser) {
      //   console.log("trying to create trade");
      //   const tradeDetails = {
      //     holder: newUser._id.toString(),
      //     ticker: person.ticker,
      //     type: "Buy",
      //     date: new Date("2015-01-01"),
      //     amount: person.amount,
      //     price: 50, // Random price for example
      //     symbol: person.symbol,
      //     name: person.curr_name,
      //     image: person.image,
      //   };
      //   const newTrade = new Trade(tradeDetails);

      //   console.log("trade details are: ", newTrade);
      //   console.log("trade details are: ", tradeDetails);

      //   await newTrade.save();

      //   console.log(newTrade);
      // }
    }
  } catch (error) {
    console.log("Error occurred", error);
  }
};
