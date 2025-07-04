import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { emailResultsSchema } from "@shared/schema";
import PDFDocument from "pdfkit";

export async function registerRoutes(app: Express): Promise<Server> {
  // PDF Download endpoint
  app.post("/api/download-pdf", async (req, res) => {
    try {
      const { workDays, expenses, totalMonthly, dailyBreakEven } = req.body;

      // Create PDF document
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=break-even-calculation.pdf");
        res.send(pdfBuffer);
      });

      // PDF Content
      doc.fontSize(24).text("Break-Even Calculator Results", { align: "center" });
      doc.moveDown();

      doc.fontSize(18).text("Summary", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Work Days per Week: ${workDays}`);
      doc.text(`Total Monthly Expenses: $${totalMonthly.toFixed(2)}`);
      doc.text(`Minimum Daily Earnings: $${dailyBreakEven.toFixed(2)}`);
      doc.moveDown();

      doc.fontSize(18).text("Expense Breakdown", { underline: true });
      doc.moveDown();
      doc.fontSize(12);

      const expenseLabels: Record<string, string> = {
        rent: "Rent/Booth Fee",
        supplies: "Supplies/Backbar",
        insurance: "Insurance/Licenses",
        marketing: "Marketing/Admin",
        taxes: "Taxes Savings",
        education: "Education/Tools",
        miscellaneous: "Miscellaneous",
      };

      Object.entries(expenses).forEach(([category, amount]) => {
        const numAmount = Number(amount);
        if (numAmount > 0) {
          const percentage = ((numAmount / totalMonthly) * 100).toFixed(1);
          doc.text(`${expenseLabels[category] || category}: $${numAmount.toFixed(2)} (${percentage}%)`);
        }
      });

      doc.moveDown();
      doc.fontSize(18).text("Methodology", { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text("Daily Break-Even = Monthly Expenses ÷ (Work Days per Week × 4.33 weeks)");
      doc.text(`$${dailyBreakEven.toFixed(2)} = $${totalMonthly.toFixed(2)} ÷ (${workDays} × 4.33)`);

      doc.end();
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Email Results endpoint
  app.post("/api/email-results", async (req, res) => {
    try {
      const validatedData = emailResultsSchema.parse(req.body);
      
      // In a real implementation, you would use a service like SendGrid, Mailgun, etc.
      // For now, we'll simulate the email sending
      console.log("Sending email to:", validatedData.email);
      console.log("Calculation data:", validatedData.calculationData);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Save calculation endpoint
  app.post("/api/calculations", async (req, res) => {
    try {
      const calculation = await storage.createCalculation(req.body);
      res.json(calculation);
    } catch (error) {
      console.error("Save calculation error:", error);
      res.status(500).json({ message: "Failed to save calculation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
