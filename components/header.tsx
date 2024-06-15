import { Separator } from "@/components/ui/separator";

export const Header = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
  return (
    <div className="h-full p-4 space-y-2 max-w-[100rem] mx-auto">
      <div className="space-y-2 w-full col-span-2">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Separator className="bg-primary/10" />
      </div>
    </div>
  );
};
