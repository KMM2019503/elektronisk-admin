import { Alert, AlertDescription, AlertTitle } from "./alert";
import { FaRegCopy, FaServer } from "react-icons/fa";
import { Badge, BadgeProps } from "./badge";
import { cn } from "@/lib/utils";
import { Button } from "./button";

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";
import { toast } from "./use-toast";

interface ApiAlertProps {
  title: string;
  desc: string;
  varient: "public" | "admin";
}

const textMap: Record<ApiAlertProps["varient"], string> = {
  public: "Public",
  admin: "Admin",
};

const varientMap: Record<ApiAlertProps["varient"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const ApiAlert = ({ title, desc, varient = "public" }: ApiAlertProps) => {
  const coCopy = (desc: string) => {
    navigator.clipboard.writeText(desc);
    toast({
      title: "Successfully copied",
      description: "Api text : " + desc,
    });
  };
  return (
    <>
      <Alert className="">
        <FaServer
          className={(cn("h-6 w-6"), varient === "admin" ? "" : "text-red-500")}
        />
        <div className="ml-[10px]">
          <AlertTitle>
            {title}{" "}
            <Badge variant={varientMap[varient]}>{textMap[varient]}</Badge>
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between w-full">
            <code className="ml-4 font-semibold">{desc}</code>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => coCopy(desc)}
                    className="rounded-full bg-orange-600 hover:bg-orange-700 text-gray-200 hover:text-neutral-50"
                    size={"sm"}
                  >
                    <FaRegCopy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white">
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </AlertDescription>
        </div>
      </Alert>
    </>
  );
};

export default ApiAlert;
