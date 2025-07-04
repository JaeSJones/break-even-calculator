import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, parseCurrency } from "@/lib/currency";

interface ExpenseCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  focusColor: string;
  tooltip: string;
}

interface ExpenseInputProps {
  category: ExpenseCategory;
  value: number;
  onChange: (value: number) => void;
}

export default function ExpenseInput({ category, value, onChange }: ExpenseInputProps) {
  const [displayValue, setDisplayValue] = useState(value > 0 ? formatCurrency(value) : "");
  const [isValid, setIsValid] = useState(value > 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setDisplayValue(rawValue);
    
    const numericValue = parseCurrency(rawValue);
    setIsValid(numericValue > 0);
    onChange(numericValue);
  };

  const handleBlur = () => {
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="expense-item"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-4 cursor-help">
            <div className={`gradient-icon bg-gradient-to-br ${category.color}`}>
              <span className="text-white text-lg">{category.icon}</span>
            </div>
            <div className="flex-1">
              <Label className="block text-sm font-medium text-foreground mb-2">
                {category.label}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                <Input
                  type="text"
                  value={displayValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  className={`expense-input bg-input border-border text-foreground pl-8 pr-12 ${category.focusColor} focus:border-transparent`}
                />
                {isValid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-400" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="tooltip-content max-w-xs">
          <p>{category.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
