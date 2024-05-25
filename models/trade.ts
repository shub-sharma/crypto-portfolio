import { Schema, model, models } from "mongoose";
import User from "@/models/user";

const TradeSchema = new Schema({
  holder: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  ticker: {
    type: String,
    required: [true, "Ticker is required."],
  },
  symbol: {
    type: String,
    required: [true, "Currency symbol is required."],
  },
  name: {
    type: String,
    required: [true, "Currency name is required."],
  },
  image: {
    type: String,
    required: [true, "Currency image is required."],
  },
  type: {
    type: String,
    required: [true, "Transaction type is required."],
  },
  date: {
    type: Date,
    required: [true, "Transaction date is required."],
  },
  amount: {
    type: Number,
    required: [
      true,
      "Transaction amount (in underlying cryptocurrency) is required.",
    ],
  },
  price: {
    type: Number,
    required: [true, "Transaction price (in USD) is required."],
  },
});

const Trade = models.Trade || model("Trade", TradeSchema);

export default Trade;
