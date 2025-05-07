import { Badge } from "./ui/badge";
import { Leaf, ShoppingCart, Factory } from "lucide-react";
import { cn } from "../libs/utils"

type UserRoleBadgeProps = {
  role: string;
  className?: string;
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const roleConfig = {
    farmer: {
      icon: Leaf,
      label: "Farmer",
      variant: "default" as const,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-800 dark:text-green-200",
    },
    consumer: {
      icon: ShoppingCart,
      label: "Consumer",
      variant: "default" as const,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-200",
    },
    manufacturer: {
      icon: Factory,
      label: "Manufacturer",
      variant: "outline" as const,
      bgColor: "bg-amber-100 dark:bg-amber-900",
      textColor: "text-amber-800 dark:text-amber-200",
    },
    undefined: {
      icon: () => null,
      label: "No Role",
      variant: "secondary" as const,
      bgColor: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-800 dark:text-gray-200",
    },
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.undefined;
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        "flex items-center gap-1 px-2 py-1", 
        config.bgColor, 
        config.textColor,
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span>{config.label}</span>
    </Badge>
  );
}