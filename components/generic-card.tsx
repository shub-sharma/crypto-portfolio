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
  icon,
}: {
  title: string;
  content: string;
  description: string;
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
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default GenericCard;
