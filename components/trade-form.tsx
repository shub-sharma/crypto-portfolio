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
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Pencil,
  Send,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface TradeInfo {
  ticker: string;
  tradeId: string;
  type: string;
  date: Date;
  amount: number;
  price: number;
}

interface TradeFormProps {
  tickersList: any;
  tradeType: string;
  initialTradeInfoData: TradeInfo | null | {};
  setTradeInfo: any;
  submitting: boolean;
  handleSubmit: any;
}

const formSchema = z.object({
  // TODO: Must be populated by calling component during api calls, not here...
  // tradeId: z.string().min(1, {
  //   message: "trade id is required.",
  // }),
  ticker: z.string().min(1, {
    message: "Ticker is required.",
  }),
  type: z.string().min(1, {
    message: "Transaction type is required.",
  }),
  date: z.date({
    required_error: "Transaction date is required.",
  }),
  amount: z.coerce.number().positive({
    message: "Cryptocurrency amount must be a positive decimal number.",
  }),
  price: z.coerce.number().positive({
    message: "Price (in USD) must be a positive decimal number.",
  }),
});

export const TradeForm = ({
  tickersList,
  tradeType,
  initialTradeInfoData,
  setTradeInfo,
  submitting,
  handleSubmit,
}: TradeFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  console.log("initialTradeInfoData :", initialTradeInfoData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialTradeInfoData || {
      ticker: "",
      type: "",
      date: undefined,
      amount: 0,
      price: 0,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting ", values);
      let response: any;
      if (initialTradeInfoData) {
        // call patch to edit trade
        response = await fetch(`/api/trade/${initialTradeInfoData.tradeId}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
      } else {
        response = await fetch("/api/trade", {
          method: "POST",
          body: JSON.stringify(values),
        });
      }

      if (response.ok) {
        router.push("/");

        toast({
          description: "Success",
        });
      }
      // Create trade

      // Refresh all server components to load up the new trade
      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
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
            {/* TODO: ~Add a combobox displaying the list of tickers~
            Add a $ placeholder for inputs 
            - Fix up placeholder issues textboxes. 
            - Add a `tradeNote` field indicating some note related to the trade.
            - Do input validation and push the data to the mongodb server */}

            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Ticker</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isLoading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? tickersList.find(
                                (ticker) => ticker.value === field.value
                              )?.label
                            : "Select ticker"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
                      <Command>
                        <CommandInput placeholder="Search tickers..." />
                        <CommandEmpty>No tickers available</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {tickersList.map((ticker, i) => (
                              <CommandItem
                                value={ticker.value}
                                key={i}
                                onSelect={() => {
                                  form.setValue("ticker", ticker.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    ticker.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {ticker.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                    <Input disabled={isLoading} type="number" {...field} />
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
                    <Input disabled={isLoading} type="number" {...field} />
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

            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-2">
                  <FormLabel>Type</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a transaction type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Buy">Buy</SelectItem>
                      <SelectItem value="Sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select a transaction type</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex justify-center">
            <Button type="submit" size="lg" disabled={isLoading}>
              {tradeType === "Edit" ? (
                <>
                  Edit Trade
                  <Pencil className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Add Trade
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
