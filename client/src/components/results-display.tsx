import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Mail, Edit, Plus, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";

interface CalculationData {
  workDays: number;
  expenses: Record<string, number>;
  totalMonthly: number;
  dailyBreakEven: number;
}

interface ResultsDisplayProps {
  calculationData: CalculationData;
  onEdit: () => void;
  onNewCalculation: () => void;
}

const expenseLabels: Record<string, string> = {
  rent: "Rent/Booth Fee",
  supplies: "Supplies/Backbar",
  insurance: "Insurance/Licenses",
  marketing: "Marketing/Admin",
  taxes: "Taxes Savings",
  education: "Education/Tools",
  miscellaneous: "Miscellaneous",
};

export default function ResultsDisplay({ calculationData, onEdit, onNewCalculation }: ResultsDisplayProps) {
  const [email, setEmail] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedDaily, setAnimatedDaily] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Animate counters
    const totalDuration = 1000;
    const dailyDuration = 1000;
    const totalSteps = 60;
    const dailySteps = 60;

    let totalStep = 0;
    let dailyStep = 0;

    const totalInterval = setInterval(() => {
      totalStep++;
      const progress = totalStep / totalSteps;
      setAnimatedTotal(calculationData.totalMonthly * progress);
      
      if (totalStep >= totalSteps) {
        clearInterval(totalInterval);
        setAnimatedTotal(calculationData.totalMonthly);
      }
    }, totalDuration / totalSteps);

    const dailyInterval = setInterval(() => {
      dailyStep++;
      const progress = dailyStep / dailySteps;
      setAnimatedDaily(calculationData.dailyBreakEven * progress);
      
      if (dailyStep >= dailySteps) {
        clearInterval(dailyInterval);
        setAnimatedDaily(calculationData.dailyBreakEven);
      }
    }, dailyDuration / dailySteps);

    return () => {
      clearInterval(totalInterval);
      clearInterval(dailyInterval);
    };
  }, [calculationData]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await apiRequest("POST", "/api/download-pdf", calculationData);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "break-even-calculation.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "PDF Downloaded",
        description: "Your break-even calculation has been saved as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailResults = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsEmailing(true);
    try {
      await apiRequest("POST", "/api/email-results", {
        email,
        calculationData,
      });
      
      toast({
        title: "Email Sent",
        description: `Your break-even calculation has been sent to ${email}.`,
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Email Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailing(false);
    }
  };

  const breakdown = Object.entries(calculationData.expenses)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      label: expenseLabels[category] || category,
      amount,
      percentage: (amount / calculationData.totalMonthly) * 100,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Results Summary */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground">Your Break-Even Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <div className="text-muted-foreground text-sm mb-2">Total Monthly Expenses</div>
              <motion.div
                className="counter text-4xl font-bold text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {formatCurrency(animatedTotal)}
              </motion.div>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <div className="text-muted-foreground text-sm mb-2">Minimum Daily Earnings</div>
              <motion.div
                className="counter text-4xl font-bold text-green-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
              >
                {formatCurrency(animatedDaily)}
              </motion.div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Expense Breakdown</h3>
            <div className="space-y-3">
              {breakdown.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center py-2 border-b border-border"
                >
                  <span className="text-foreground">{item.label}</span>
                  <div className="text-right">
                    <span className="text-foreground font-semibold">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-muted/50 rounded-lg p-6 mt-8">
            <h4 className="font-semibold mb-3 text-foreground">How We Calculate</h4>
            <p className="text-muted-foreground text-sm">
              Daily Break-Even = Monthly Expenses ÷ (Work Days per Week × 4.33 weeks)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Export Your Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="btn-primary text-primary-foreground font-semibold"
            >
              {isDownloading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 mr-2"
                >
                  <Download className="w-4 h-4" />
                </motion.div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </Button>
            <div className="flex space-x-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 bg-input border-border text-foreground"
              />
              <Button
                onClick={handleEmailResults}
                disabled={isEmailing}
                className="btn-secondary text-primary-foreground font-semibold"
              >
                {isEmailing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onEdit}
          variant="outline"
          className="flex-1 bg-muted border-border text-muted-foreground hover:bg-muted/80"
        >
          <Edit className="w-4 h-4 mr-2" />
          Review & Edit
        </Button>
        <Button
          onClick={onNewCalculation}
          className="btn-primary text-primary-foreground font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Calculation
        </Button>
      </div>
    </motion.div>
  );
}
