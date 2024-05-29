import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

export const GenericCard = ({
  title,
  content,
  description,
  description_percent_change,
  icon,
}: {
  title: string;
  content: string;
  description: string | undefined;
  description_percent_change: number | undefined;
  icon: ReactNode;
}) => {
  return (
    <Card className="col-span-4 md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>

        {description_percent_change ? (
          <p
            className={
              description_percent_change < 0
                ? "mt-1 text-sm  text-red-600"
                : "mt-1 text-sm  text-green-600"
            }
          >
            {description_percent_change}%
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {/* <p className="mt-1 text-sm text-muted-foreground">{description}</p> */}
      </CardContent>
    </Card>
  );
};

export default GenericCard;
