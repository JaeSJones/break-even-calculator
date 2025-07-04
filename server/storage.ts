import { users, calculations, type User, type InsertUser, type Calculation, type InsertCalculation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculation(id: number): Promise<Calculation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calculations: Map<number, Calculation>;
  private currentUserId: number;
  private currentCalculationId: number;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.currentUserId = 1;
    this.currentCalculationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = this.currentCalculationId++;
    const calculation: Calculation = {
      id,
      workDays: insertCalculation.workDays,
      totalMonthly: insertCalculation.totalMonthly,
      dailyBreakEven: insertCalculation.dailyBreakEven,
      rent: insertCalculation.rent ?? 0,
      supplies: insertCalculation.supplies ?? 0,
      insurance: insertCalculation.insurance ?? 0,
      marketing: insertCalculation.marketing ?? 0,
      taxes: insertCalculation.taxes ?? 0,
      education: insertCalculation.education ?? 0,
      miscellaneous: insertCalculation.miscellaneous ?? 0,
      createdAt: new Date(),
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getCalculation(id: number): Promise<Calculation | undefined> {
    return this.calculations.get(id);
  }
}

export const storage = new MemStorage();
