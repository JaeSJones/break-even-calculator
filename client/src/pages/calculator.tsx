import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator as CalculatorIcon, ArrowRight, Edit, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import ExpenseInput from "@/components/expense-input";
import ResultsDisplay from "@/components/results-display";
import { calculateBreakEven, validateInputs } from "@/lib/calculations";
import { saveCalculation, loadCalculation } from "@/lib/storage";
import { formatCurrency } from "@/lib/currency";

interface CalculationData {
  workDays: number;
  expenses: Record<string, number>;
  totalMonthly: number;
  dailyBreakEven: number;
}

const expenseCategories = [
  {
    id: "rent",
    label: "Rent/Booth Fee",
    icon: "🏠",
    color: "from-pink-300 to-pink-400",
    focusColor: "focus:ring-pink-300",
    tooltip: "Monthly rent for your chair or booth space. This is typically your largest fixed expense.",
  },
  {
    id: "supplies",
    label: "Supplies/Backbar",
    icon: "🛍️",
    color: "from-green-300 to-green-400",
    focusColor: "focus:ring-green-300",
    tooltip: "Products, tools, and supplies needed for your services. Include shampoo, color, styling products, etc.",
  },
  {
    id: "insurance",
    label: "Insurance/Licenses",
    icon: "🛡️",
    color: "from-purple-300 to-purple-400",
    focusColor: "focus:ring-purple-300",
    tooltip: "Professional liability insurance, cosmetology license renewals, and any required certifications.",
  },
  {
    id: "marketing",
    label: "Marketing/Admin",
    icon: "📢",
    color: "from-orange-300 to-orange-400",
    focusColor: "focus:ring-orange-300",
    tooltip: "Social media ads, business cards, website costs, booking software, and administrative expenses.",
  },
  {
    id: "taxes",
    label: "Taxes Savings",
    icon: "🐷",
    color: "from-blue-300 to-blue-400",
    focusColor: "focus:ring-blue-300",
    tooltip: "Amount to set aside for quarterly taxes. Generally 25-30% of your income if you're self-employed.",
  },
  {
    id: "education",
    label: "Education/Tools",
    icon: "🎓",
    color: "from-indigo-300 to-indigo-400",
    focusColor: "focus:ring-indigo-300",
    tooltip: "Continuing education, workshops, new tools, and equipment to keep your skills current.",
  },
  {
    id: "miscellaneous",
    label: "Miscellaneous",
    icon: "⚡",
    color: "from-gray-300 to-gray-400",
    focusColor: "focus:ring-gray-300",
    tooltip: "Other business expenses like phone bills, transportation, uniforms, or unexpected costs.",
  },
];

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [workDays, setWorkDays] = useState(5);
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = loadCalculation();
    if (saved) {
      setWorkDays(saved.workDays);
      setExpenses(saved.expenses);
    }
  }, []);

  const handleExpenseChange = (category: string, value: number) => {
    const newExpenses = { ...expenses, [category]: value };
    setExpenses(newExpenses);
    saveCalculation({ workDays, expenses: newExpenses });
  };

  const handleWorkDaysChange = (value: number) => {
    setWorkDays(value);
    saveCalculation({ workDays: value, expenses });
  };

  const handleCalculate = async () => {
    if (!validateInputs(expenses)) {
      toast({
        title: "Missing Information",
        description: "Please enter at least one expense amount to calculate your break-even point.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = calculateBreakEven(expenses, workDays);
    setCalculationData(result);
    setCurrentStep(2);
    setIsCalculating(false);

    toast({
      title: "Calculation Complete",
      description: `Your minimum daily earnings needed: ${formatCurrency(result.dailyBreakEven)}`,
    });
  };

  const handleReset = () => {
    setWorkDays(5);
    setExpenses({});
    setCalculationData(null);
    setCurrentStep(1);
    localStorage.removeItem("beauticianCalculator");
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  const handleEdit = () => {
    setCurrentStep(1);
  };

  const handleNewCalculation = () => {
    handleReset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="gradient-icon bg-gradient-to-br from-pink-400 to-purple-600">
                <CalculatorIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Break-Even Calculator</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of 2
            </div>
          </div>
          <div className="mt-4 bg-muted rounded-full h-2">
            <div 
              className="progress-bar transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep === 1 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Description */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-primary">For Beauty Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Calculate the minimum daily income needed to cover your salon expenses. Perfect for beauticians who rent chairs or booths and want to price their services effectively.
                </p>
              </CardContent>
            </Card>

            {/* Work Days Input */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">How many days a week do you plan to work?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    min="1"
                    max="7"
                    value={workDays}
                    onChange={(e) => handleWorkDaysChange(parseInt(e.target.value) || 1)}
                    className="w-24 text-center text-xl font-semibold bg-input border-border text-foreground"
                  />
                  <Label className="text-muted-foreground">days per week</Label>
                </div>
              </CardContent>
            </Card>

            {/* Expense Categories */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {expenseCategories.map((category) => (
                    <ExpenseInput
                      key={category.id}
                      category={category}
                      value={expenses[category.id] || 0}
                      onChange={(value) => handleExpenseChange(category.id, value)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="bg-muted border-border text-muted-foreground hover:bg-muted/80"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="btn-primary flex-1 text-primary-foreground font-semibold"
              >
                {isCalculating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Calculate Break-Even
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsDisplay
              calculationData={calculationData!}
              onEdit={handleEdit}
              onNewCalculation={handleNewCalculation}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
