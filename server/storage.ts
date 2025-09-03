import { type User, type InsertUser, type Conversion, type InsertConversion } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  getRecentConversions(limit?: number): Promise<Conversion[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversions: Map<string, Conversion>;

  constructor() {
    this.users = new Map();
    this.conversions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createConversion(insertConversion: InsertConversion): Promise<Conversion> {
    const id = randomUUID();
    const conversion: Conversion = {
      ...insertConversion,
      id,
      createdAt: new Date(),
    };
    this.conversions.set(id, conversion);
    return conversion;
  }

  async getRecentConversions(limit = 10): Promise<Conversion[]> {
    return Array.from(this.conversions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
