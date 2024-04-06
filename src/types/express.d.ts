import { Request } from "express";
import { User } from "@prisma/client";

declare module 'express' {
  interface Request {
    user?: User; // Define the user property as optional
  }
}