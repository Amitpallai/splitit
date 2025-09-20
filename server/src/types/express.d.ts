// src/types/express.d.ts
import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}
// src/types/express.d.ts
import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    user?: any;
  }
}
