import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradeInfoProps {
  userId: string;
  ticker: string;
  type: string;
  date: Date;
  amount: number;
  price: number;
}

const formSchema = z.object({
  userId: z.string().min(1, {
    message: "Userid is required.",
  }),
  ticker: z.string().min(1, {
    message: "Ticker is required.",
  }),
  type: z.string().min(1, {
    message: "Transaction type is required.",
  }),
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  amount: z.number().int().positive({
    message: "Cryptocurrency amount must be a positive integer.",
  }),
  price: z.number().int().positive({
    message: "Price (in USD) must be a positive integer.",
  }),
});

export const TradeForm = ({
  tickersList,
  tradeType,
  tradeInfo,
  setTradeInfo,
  submitting,
  handleSubmit,
}: {
  tickersList: any;
  tradeType: string;
  tradeInfo: TradeInfoProps;
  setTradeInfo: any;
  submitting: boolean;
  handleSubmit: any;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: tradeInfo || {
      userId: "",
      ticker: "",
      type: "",
      date: undefined,
      amount: 0,
      price: 0,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-18"
        >
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">{tradeType} Trade</h3>
              <p className="text-sm text-muted-foreground">
                {tradeType} your cryptocurrency trades here
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="ticker"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Ticker</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="BTC" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ticker of your cryptocurrency
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription>Amount in cryptocurrency</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="BTC" {...field} />
                  </FormControl>
                  <FormDescription>
                    Price of cryptocurrency (USD)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isLoading}
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Transaction date</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
